import { spawn } from "child_process";

const child = spawn("npx tsx watch src/server.ts", {
  shell: true,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
