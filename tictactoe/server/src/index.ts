import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom, generateRoomCode, getRoom, findRoomByPlayerId } from "./roomManager";
import { checkWinner, createInitialGameState, getRandomDare } from "./gameLogic";
import { ChatMessage, Symbol, Tier, DareStatus } from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("create_room", () => {
    const code = generateRoomCode();
    const room = createRoom(code);
    room.players.push({ id: socket.id, symbol: "X" });
    socket.join(code);
    socket.emit("room_created", { code, symbol: "X" });
    console.log(`Room created: ${code} by ${socket.id}`);
  });

  socket.on("set_tier", ({ code, tier }: { code: string, tier: Tier }) => {
    const room = getRoom(code);
    if (!room) return;
    room.gameState.tier = tier;
    io.to(code).emit("game_update", room.gameState);
  });

  socket.on("join_room", ({ code }: { code: string }) => {
    const room = getRoom(code);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }
    if (room.players.length >= 2) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    const symbol: Symbol = "O";
    room.players.push({ id: socket.id, symbol });
    socket.join(code);
    socket.emit("room_joined", { code, symbol, board: room.gameState.board });

    // Notify the creator
    socket.to(code).emit("player_joined");

    // Send initial game state to the joining player
    socket.emit("game_update", room.gameState);

    console.log(`User ${socket.id} joined room ${code} as ${symbol}`);
  });

  socket.on("make_move", ({ index }: { index: number }) => {
    const room = findRoomByPlayerId(socket.id);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const { gameState } = room;

    if (gameState.winner || gameState.board[index] || gameState.currentTurn !== player.symbol) {
      return;
    }

    gameState.board[index] = player.symbol;
    const { winner, winningIndices } = checkWinner(gameState.board);
    gameState.winner = winner;
    gameState.winningIndices = winningIndices;

    if (winner && winner !== "draw") {
      const loser = winner === "X" ? "O" : "X";
      gameState.dareFor = loser;
      gameState.currentDare = getRandomDare(gameState.tier);
    }

    gameState.currentTurn = player.symbol === "X" ? "O" : "X";

    io.to(room.code).emit("game_update", gameState);
  });

  socket.on("dare_status_update", ({ status }: { status: DareStatus }) => {
    const room = findRoomByPlayerId(socket.id);
    if (!room) return;

    const { gameState } = room;
    gameState.dareStatus = status;

    if (status === "done" && gameState.winner && gameState.winner !== "draw") {
      gameState.scores[gameState.winner] += 1;
    } else if (status === "chickened" && gameState.dareFor) {
      gameState.scores[`${gameState.dareFor}chicken` as keyof typeof gameState.scores] += 1;
    }

    io.to(room.code).emit("game_update", gameState);
  });

  socket.on("send_reaction", ({ emoji }: { emoji: string }) => {
    const room = findRoomByPlayerId(socket.id);
    if (!room) return;
    io.to(room.code).emit("new_reaction", { emoji, id: Date.now() + Math.random() });
  });

  socket.on("send_message", ({ text }: { text: string }) => {
    const room = findRoomByPlayerId(socket.id);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const message: ChatMessage = {
      sender: player.symbol,
      text,
      timestamp: Date.now()
    };
    room.messages.push(message);
    io.to(room.code).emit("new_message", message);
  });

  socket.on("request_rematch", () => {
    const room = findRoomByPlayerId(socket.id);
    if (!room) return;

    room.rematchRequested.add(socket.id);

    if (room.rematchRequested.size === room.players.length) {
      room.gameState = createInitialGameState(room.gameState.tier, room.gameState.scores);
      room.rematchRequested.clear();
      io.to(room.code).emit("rematch_ready", { board: room.gameState.board });
      io.to(room.code).emit("game_update", room.gameState);
    } else {
        // Optionally notify other player that a rematch was requested
        socket.to(room.code).emit("new_message", {
            sender: room.players.find(p => p.id === socket.id)?.symbol,
            text: "Requested a rematch!",
            timestamp: Date.now()
        });
    }
  });

  socket.on("disconnect", () => {
    const room = findRoomByPlayerId(socket.id);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      socket.to(room.code).emit("new_message", {
        sender: player?.symbol,
        text: "Your opponent left the game 👋",
        timestamp: Date.now()
      });
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
