import fs from "fs";
import path from "path";

// Path to the directory containing SVG icons
const iconsDir = path.join(process.cwd(), "./public/assets/icons");
const outputIconExportFile = path.join(iconsDir, "index.ts");
const outputIconTypeFile = path.join(
  process.cwd(),
  "./src/types/icon-names.ts"
);

// Function to convert kebab-case to PascalCase
const kebabToPascalCase = (str) =>
  str
    .replace(/-./g, (match) => match[1].toUpperCase())
    .replace(/^[a-z]/, (match) => match.toUpperCase());

// Reading the icons directory
fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error("Error reading the icons directory:", err);
    return;
  }

  const iconTypes = files
    .filter((file) => file.endsWith(".svg")) // Filter only .svg files
    .map((file) => file.replace(/\.svg$/, "")) // Remove the .svg extension
    .map(kebabToPascalCase); // Convert file names to PascalCase

  // Create content for the types file
  const content = `export type IconNames = ${iconTypes
    .map((type) => `'${type}'`)
    .join(" | ")};\n`;

  // Write to the types file
  fs.writeFile(outputIconTypeFile, content, (err) => {
    if (err) {
      console.error("Error writing to the types file:", err);
      return;
    }
    console.log("Icon names type file updated successfully.");
  });
});

// Read all SVG files from the icons directory
const files = fs.readdirSync(iconsDir).filter((file) => file.endsWith(".svg"));

// Generate import and export statements
const imports = files
  .map((file) => {
    const name = path.basename(file, ".svg"); // Remove .svg extension
    const componentName = name
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) // Convert kebab-case to camelCase
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

    return `import ${componentName} from './${file}';`;
  })
  .join("\n");

const exports = `export {\n  ${files
  .map((file) => {
    const name = path.basename(file, ".svg");
    const componentName = name
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) // Convert kebab-case to camelCase
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
    return `  ${componentName},`;
  })
  .join("\n")}
};\n`;

// Write to index.ts
fs.writeFileSync(outputIconExportFile, `${imports}\n\n${exports}`, "utf-8");

console.log(`✅ Successfully generated icon imports index.ts in ${iconsDir}`);
