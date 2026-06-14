import { execSync } from "node:child_process";

const port = process.argv[2] || "8010";
try {
  const out = execSync(
    `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`,
    { encoding: "utf8" }
  );
  const pids = [...new Set(out.trim().split(/\r?\n/).filter(Boolean))];
  for (const pid of pids) {
    try {
      execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
      console.log(`Stopped PID ${pid} (was using port ${port}).`);
    } catch {
      /* ignore */
    }
  }
  if (pids.length === 0) console.log(`Nothing listening on port ${port}.`);
} catch {
  console.log(`Nothing listening on port ${port}.`);
}
