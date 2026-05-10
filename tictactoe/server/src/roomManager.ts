import { Room, Tier } from "./types";
import { createInitialGameState } from "./gameLogic";
import { initDB, saveRoomToDB, deleteRoomFromDB, getAllRoomsFromDB } from "./db";

const rooms = new Map<string, Room>();
const ROOM_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const initRooms = async () => {
  await initDB();
  const dbRooms = await getAllRoomsFromDB();
  dbRooms.forEach(room => {
    rooms.set(room.code, room);
  });

  // Periodically clean up expired rooms
  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
      if (now - room.lastActivity >= ROOM_TIMEOUT) {
        rooms.delete(code);
        deleteRoomFromDB(code);
        console.log(`Room ${code} expired`);
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

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

export const createRoom = async (code: string, tier: Tier = null): Promise<Room> => {
  const room: Room = {
    code,
    players: [],
    gameState: createInitialGameState(tier),
    messages: [],
    lastActivity: Date.now(),
    rematchRequested: new Set()
  };
  rooms.set(code, room);
  await saveRoomToDB(room);

  return room;
};

export const getRoom = (code: string): Room | undefined => {
  const room = rooms.get(code);
  if (room) {
    room.lastActivity = Date.now();
    saveRoomToDB(room);
  }
  return room;
};

export const deleteRoom = (code: string) => {
  rooms.delete(code);
  deleteRoomFromDB(code);
};

export const findRoomByPlayerId = (playerId: string): Room | undefined => {
  for (const room of rooms.values()) {
    if (room.players.find(p => p.id === playerId)) {
      return room;
    }
  }
  return undefined;
};
