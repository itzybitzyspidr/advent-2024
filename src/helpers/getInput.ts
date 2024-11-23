import { configDotenv } from "dotenv";

export function getConfigVars(): void {
  configDotenv();
  console.log(process.env['COOKIE']);
}
