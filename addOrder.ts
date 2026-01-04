import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ESM workaround to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON using fs (async)
const inputPath = path.join(__dirname, "c3_modules_full.json");
const outputPath = path.join(__dirname, "c3_modules_full_with_order.json");

async function addOrderToLearningCards() {
  const jsonText = await fs.readFile(inputPath, "utf-8");
  const modules = JSON.parse(jsonText);

  for (const module of modules) {
    for (const section of module.sections) {
      section.learningCards = section.learningCards.map(
        (card: { [key: string]: any }, index: number) => ({
          ...card,
          order: index + 1,
        })
      );

    }
  }

  await fs.writeFile(outputPath, JSON.stringify(modules, null, 2));
  console.log("✅ Done! Output written to:", outputPath);
}

addOrderToLearningCards().catch(console.error);
