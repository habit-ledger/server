import * as dotenv from 'dotenv';

export function getEnvVar(arg: string): string {
  return process.env[arg] ?? '';
}

export function loadDotEnv(): void {
  dotenv.config();
}
