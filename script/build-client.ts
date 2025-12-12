import { build as viteBuild } from "vite";

async function buildClient() {
  console.log("building client...");
  await viteBuild();
  console.log("client build complete!");
}

buildClient().catch((err) => {
  console.error(err);
  process.exit(1);
});
