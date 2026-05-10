import { Pool } from 'pg';
import { Room } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

export const initDB = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    console.error("CRITICAL: DATABASE_URL is not set. Database persistence is required for room storage.");
    process.exit(1);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        code TEXT PRIMARY KEY,
        data JSONB
      )
    `);
    console.log("PostgreSQL database initialized.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
};

export const saveRoomToDB = async (room: Room): Promise<void> => {
  if (!process.env.DATABASE_URL) return;

  const roomData = {
    ...room,
    rematchRequested: Array.from(room.rematchRequested)
  };

  try {
    await pool.query(
      `INSERT INTO rooms (code, data) VALUES ($1, $2)
       ON CONFLICT (code) DO UPDATE SET data = $2`,
      [room.code, JSON.stringify(roomData)]
    );
  } catch (err) {
    console.error(`Failed to save room ${room.code}:`, err);
    throw err;
  }
};

export const getRoomFromDB = async (code: string): Promise<Room | null> => {
  if (!process.env.DATABASE_URL) return null;

  try {
    const res = await pool.query(`SELECT data FROM rooms WHERE code = $1`, [code]);
    if (res.rows.length === 0) {
      return null;
    }
    const room = res.rows[0].data;
    room.rematchRequested = new Set(room.rematchRequested);
    return room;
  } catch (err) {
    console.error(`Failed to get room ${code}:`, err);
    throw err;
  }
};

export const deleteRoomFromDB = async (code: string): Promise<void> => {
  if (!process.env.DATABASE_URL) return;

  try {
    await pool.query(`DELETE FROM rooms WHERE code = $1`, [code]);
  } catch (err) {
    console.error(`Failed to delete room ${code}:`, err);
    throw err;
  }
};

export const getAllRoomsFromDB = async (): Promise<Room[]> => {
  if (!process.env.DATABASE_URL) return [];

  try {
    const res = await pool.query(`SELECT data FROM rooms`);
    return res.rows.map((row) => {
      const room = row.data;
      room.rematchRequested = new Set(room.rematchRequested);
      return room;
    });
  } catch (err) {
    console.error("Failed to get all rooms:", err);
    throw err;
  }
};
