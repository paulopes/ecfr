#!/usr/bin/env node

process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.name === "DeprecationWarning") return;
  console.warn(w);
});

import readline from "readline/promises";
import { writeFile } from "fs/promises";
import HTMLtoDOCX from "html-to-docx";

async function main() {
  const args = process.argv.slice(2);
  const outputDocx = args.includes("--docx") || args.includes("-d");
  const positionalArgs = args.filter((arg) => arg !== "--docx" && arg !== "-d");
  let date, title, part;

  if (positionalArgs.length >= 3) {
    [date, title, part] = positionalArgs;
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    date = await rl.question("Date of document version (YYYY-MM-DD): ");
    title = await rl.question("Title number: ");
    part = await rl.question("Part number: ");
    rl.close();
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error("Invalid date format. Use YYYY-MM-DD.");
    process.exit(1);
  }

  const url = `https://www.ecfr.gov/api/renderer/v1/content/enhanced/${date}/title-${title}?part=${part}`;
  console.log(`\nFetching: ${url}\n`);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Request failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const html = await res.text();

  if (outputDocx) {
    const sanitizedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, "");

    console.log(`Received ${sanitizedHtml.length} characters of HTML. Converting to DOCX...`);

    const docxBuffer = await HTMLtoDOCX(sanitizedHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    const filename = `ecfr_title${title}_part${part}_${date}.docx`;
    await writeFile(filename, docxBuffer);
    console.log(`Saved: ${filename}`);
    return;
  }

  const filename = `ecfr_title${title}_part${part}_${date}.html`;
  await writeFile(filename, html, "utf8");
  console.log(`Saved: ${filename}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
