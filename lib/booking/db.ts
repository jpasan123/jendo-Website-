import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __jendoBookingPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __jendoBookingSchema: Promise<void> | undefined;
}

export function getPool(): Pool {
  if (!globalThis.__jendoBookingPool) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    globalThis.__jendoBookingPool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    globalThis.__jendoBookingPool.on("error", (err) => {
      console.error("[booking-db] idle client error:", err.message);
    });
  }
  return globalThis.__jendoBookingPool;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS test_bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref              text NOT NULL UNIQUE,
  full_name        text NOT NULL,
  phone            text NOT NULL,
  email            text,
  notes            text,
  appointment_date date NOT NULL,
  slot_time        char(5) NOT NULL,
  amount_lkr       integer NOT NULL,
  status           text NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','confirmed','completed','no_show','cancelled')),
  payment_status   text NOT NULL DEFAULT 'unpaid'
                   CHECK (payment_status IN ('unpaid','slip_uploaded','paid')),
  payment_method   text NOT NULL DEFAULT 'pay_at_venue'
                   CHECK (payment_method IN ('pay_at_venue','bank_transfer')),
  slip_file        text,
  slip_mime        text,
  slip_uploaded_at timestamptz,
  admin_notes      text,
  follow_up_on     date,
  created_ip       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- One active booking per slot (cancelled / no-show bookings free the slot)
CREATE UNIQUE INDEX IF NOT EXISTS test_bookings_active_slot
  ON test_bookings (appointment_date, slot_time)
  WHERE status IN ('new','confirmed','completed');

CREATE INDEX IF NOT EXISTS test_bookings_date_idx ON test_bookings (appointment_date);
CREATE INDEX IF NOT EXISTS test_bookings_created_idx ON test_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS test_bookings_phone_idx ON test_bookings (phone);

-- Every email the system tries to send (sent / failed / skipped), for the admin panel
CREATE TABLE IF NOT EXISTS booking_emails (
  id         bigserial PRIMARY KEY,
  booking_id uuid REFERENCES test_bookings(id) ON DELETE CASCADE,
  kind       text NOT NULL,
  to_email   text,
  status     text NOT NULL CHECK (status IN ('sent','failed','skipped')),
  error      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_emails_booking_idx ON booking_emails (booking_id, created_at DESC);
`;

/** Creates the tables on first use. Safe to call on every request. */
export function ensureSchema(): Promise<void> {
  if (!globalThis.__jendoBookingSchema) {
    globalThis.__jendoBookingSchema = (async () => {
      const client = await getPool().connect();
      try {
        // Serialises concurrent first-time setups (several workers starting together)
        await client.query("SELECT pg_advisory_lock(947311)");
        try {
          await client.query(SCHEMA_SQL);
        } finally {
          await client.query("SELECT pg_advisory_unlock(947311)");
        }
      } finally {
        client.release();
      }
    })().catch((err) => {
      globalThis.__jendoBookingSchema = undefined;
      throw err;
    });
  }
  return globalThis.__jendoBookingSchema;
}

/**
 * pool.query with one automatic recovery: if the tables are missing (database recreated or
 * restored empty while the server kept running), build the schema again and retry once.
 */
export async function query(text: string, params?: unknown[]) {
  try {
    return await getPool().query(text, params);
  } catch (err) {
    if ((err as { code?: string }).code !== "42P01") throw err;
    globalThis.__jendoBookingSchema = undefined;
    await ensureSchema();
    return getPool().query(text, params);
  }
}
