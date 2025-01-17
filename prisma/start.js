const util = require("util");
const exec = util.promisify(require("child_process").exec);

const fs = require("fs");
const path = require("path");

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

  if (fs.existsSync(path.join(process.cwd(), "db", "jiffy.db"))) {
    // for now do nothing?
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
