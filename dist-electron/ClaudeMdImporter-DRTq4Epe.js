import fs from "fs/promises";
class ClaudeMdImporter {
  async parse(filePath) {
    const content = await fs.readFile(filePath, "utf-8");
    return this.parseContent(content);
  }
  parseContent(content) {
    const lines = content.split("\n");
    const rules = [];
    let currentRule = null;
    let buffer = [];
    for (const line of lines) {
      if (line.startsWith("### ")) {
        if (currentRule && buffer.length > 0) {
          rules.push({
            name: currentRule.name,
            content: buffer.join("\n").trim()
          });
        }
        currentRule = {
          name: line.substring(4).trim()
        };
        buffer = [];
      } else if (line.startsWith("## Active Rules")) {
        currentRule = null;
        buffer = [];
      } else if (line.startsWith("## ") && line !== "## Active Rules") {
        if (currentRule && buffer.length > 0) {
          rules.push({
            name: currentRule.name,
            content: buffer.join("\n").trim()
          });
        }
        currentRule = null;
        buffer = [];
      } else {
        if (currentRule) {
          buffer.push(line);
        }
      }
    }
    if (currentRule && buffer.length > 0) {
      rules.push({
        name: currentRule.name,
        content: buffer.join("\n").trim()
      });
    }
    return rules;
  }
}
export {
  ClaudeMdImporter
};
