import { getPool } from "@/lib/booking/db";

declare global {
  // eslint-disable-next-line no-var
  var __jendoAuthSchema: Promise<void> | undefined;
}

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  name          text,
  password_hash text,
  google_id     text UNIQUE,
  image         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_users_email_idx ON app_users (lower(email));
`;

/** Creates the users table on first use. Safe to call on every request. */
export function ensureAuthSchema(): Promise<void> {
  if (!globalThis.__jendoAuthSchema) {
    globalThis.__jendoAuthSchema = (async () => {
      const client = await getPool().connect();
      try {
        // Serialises concurrent first-time setups (several workers starting together)
        await client.query("SELECT pg_advisory_lock(947312)");
        try {
          await client.query(SCHEMA_SQL);
        } finally {
          await client.query("SELECT pg_advisory_unlock(947312)");
        }
      } finally {
        client.release();
      }
    })().catch((err) => {
      globalThis.__jendoAuthSchema = undefined;
      throw err;
    });
  }
  return globalThis.__jendoAuthSchema;
}

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  google_id: string | null;
  image: string | null;
};

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  await ensureAuthSchema();
  const { rows } = await getPool().query(
    "SELECT id, email, name, password_hash, google_id, image FROM app_users WHERE lower(email) = lower($1) LIMIT 1",
    [email]
  );
  return rows[0] ?? null;
}

export async function createUserWithPassword(email: string, name: string, passwordHash: string): Promise<AppUser> {
  await ensureAuthSchema();
  const { rows } = await getPool().query(
    `INSERT INTO app_users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, name, password_hash, google_id, image`,
    [email, name, passwordHash]
  );
  return rows[0];
}

/** Finds a user by Google account, or creates one on first Google sign-in (linking by email if it already exists). */
export async function findOrCreateGoogleUser(params: { googleId: string; email: string; name: string | null; image: string | null }): Promise<AppUser> {
  await ensureAuthSchema();
  const pool = getPool();

  const byGoogleId = await pool.query(
    "SELECT id, email, name, password_hash, google_id, image FROM app_users WHERE google_id = $1 LIMIT 1",
    [params.googleId]
  );
  if (byGoogleId.rows[0]) return byGoogleId.rows[0];

  // Same email already registered manually - link the Google account to it.
  const byEmail = await pool.query(
    "SELECT id, email, name, password_hash, google_id, image FROM app_users WHERE lower(email) = lower($1) LIMIT 1",
    [params.email]
  );
  if (byEmail.rows[0]) {
    const { rows } = await pool.query(
      `UPDATE app_users SET google_id = $1, image = COALESCE(image, $2), updated_at = now()
       WHERE id = $3
       RETURNING id, email, name, password_hash, google_id, image`,
      [params.googleId, params.image, byEmail.rows[0].id]
    );
    return rows[0];
  }

  const { rows } = await pool.query(
    `INSERT INTO app_users (email, name, google_id, image)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, password_hash, google_id, image`,
    [params.email, params.name, params.googleId, params.image]
  );
  return rows[0];
}
