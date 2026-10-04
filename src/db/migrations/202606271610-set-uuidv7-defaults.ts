import type { SQL } from '@/db/types';

// No-op for databases created by this release: the create-table migrations already
// default ids to uuidv7(). Kept so databases created before that change converge
// on the same defaults without altering migration history.
export default async (db: SQL) => {
  await db`ALTER TABLE IF EXISTS app.projects ALTER COLUMN id SET DEFAULT uuidv7()`;
  await db`ALTER TABLE IF EXISTS app.events ALTER COLUMN id SET DEFAULT uuidv7()`;
};
