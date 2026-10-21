import "dotenv/config";
import { spawnSync } from "node:child_process";
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    "validate",
    "--schema",
    "backend/prisma/schema.prisma",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.DATABASE_URL || "postgresql://127.0.0.1:5432/charanga",
    },
    windowsHide: true,
  },
);
process.exitCode = result.status ?? 1;
