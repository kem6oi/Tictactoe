import { Room, Tier } from "./types";
import { createInitialGameState } from "./gameLogic";

const rooms = new Map<string, Room>();
const ROOM_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const generateRoomCode = (): string => {
  let code: string;
  do {
    // TAC-7X2 style or just 6 chars
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking chars
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `${randomPart.slice(0, 3)}-${randomPart.slice(3)}`;
  } while (rooms.has(code));
  return code;
};

export const createRoom = (code: string, tier: Tier = null): Room => {
  const room: Room = {
    code,
    players: [],
    gameState: createInitialGameState(tier),
    messages: [],
    lastActivity: Date.now(),
    rematchRequested: new Set()
  };
  rooms.set(code, room);

  // Set expiration
  setTimeout(() => {
    const currentRoom = rooms.get(code);
    if (currentRoom && Date.now() - currentRoom.lastActivity >= ROOM_TIMEOUT) {
      rooms.delete(code);
      console.log(`Room ${code} expired`);
    }
  }, ROOM_TIMEOUT);

  return room;
};

export const getRoom = (code: string): Room | undefined => {
  const room = rooms.get(code);
  if (room) {
    room.lastActivity = Date.now();
  }
  return room;
};

export const deleteRoom = (code: string) => {
  rooms.delete(code);
};

export const findRoomByPlayerId = (playerId: string): Room | undefined => {
  for (const room of rooms.values()) {
    if (room.players.find(p => p.id === playerId)) {
      return room;
    }
  }
  return undefined;
};
