const util = require("util");
const exec = util.promisify(require("child_process").exec);

const fs = require("fs");
const path = require("path");

function getDbPath() {
  // Use DB_PATH env var if set (for Render persistent disk), otherwise default
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }
  return path.join(process.cwd(), "db", "jiffy.db");
}

async function execute(command) {
  try {
    console.log(`Running ${command}`);
    const { stdout, stderr } = await exec(command);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

async function startUp() {
  await execute("echo the PWD is : ${PWD}");

  const dbPath = getDbPath();
  console.log(`Database path: ${dbPath}`);

  // Ensure the directory exists (important for persistent disk)
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    console.log(`Creating database directory: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    console.log("we have a database already.");
  } else {
    await execute("npx prisma db push --skip-generate");
  }

  // TODO: Figure out why the seed can't exist inside the prisma folder
  await execute("cp prisma/seed.ts db/");
  await execute("npm install --no-save ts-node");

  // Seed checks for the default user first so it's always safe to run
  await execute(`npx prisma db seed`);
}

startUp();
