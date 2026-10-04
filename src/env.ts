import { z } from 'zod';

import { envSchema } from './config';

export type { Env } from './config';

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // The logger is not configured yet, so the error is written directly to stderr.
  // eslint-disable-next-line no-console
  console.error(`Invalid configuration:\n${z.prettifyError(parsed.error)}`);
  process.exit(1);
}
export const env = parsed.data;
