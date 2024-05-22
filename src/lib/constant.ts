import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PUBLIC_KEY = process.env.IS_PUBLIC_KEY;

export function defaultOptionsQuery(
  page: number = 1,
  limit: number = 10,
  sort: string = 'asc',
  ...args: any[]
): any {
  return { page, limit, sort, ...args };
}
