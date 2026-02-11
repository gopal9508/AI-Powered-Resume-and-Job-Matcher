import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs/promises";
import path from "path";

class FileParser {
  /* ===============================
     PARSE PDF
  ================================ */
  static async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);

      // DEBUG (you can remove later)
      console.log("PDF TEXT LENGTH:", data.text?.length || 0);

      return {
        text: data.text || "",
        metadata: {
          pages: data.numpages || 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  /* ===============================
     PARSE DOCX
  ================================ */
  static async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });

      // DEBUG (you can remove later)
      console.log("DOCX TEXT LENGTH:", result.value?.length || 0);

      return {
        text: result.value || "",
        metadata: {},
      };
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error.message}`);
    }
  }

  /* ===============================
     PARSE FILE (AUTO-DETECT)
  ================================ */
  static async parseFile(filePath) {
    try {
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();

      if (ext === ".pdf") {
        return await this.parsePDF(buffer);
      }

      if (ext === ".docx" || ext === ".doc") {
        return await this.parseDOCX(buffer);
      }

      throw new Error("Unsupported file format");
    } catch (error) {
      throw new Error(`Failed to parse file: ${error.message}`);
    }
  }

  /* ===============================
     CLEAN TEXT (SAFE VERSION)
  ================================ */
  static cleanText(text = "") {
    if (!text) return "";

    return text
      .replace(/\r\n/g, "\n")          // normalize line endings
      .replace(/\n{2,}/g, "\n")        // remove extra blank lines
      .replace(/[ \t]+/g, " ")         // normalize spaces (KEEP newlines)
      .replace(/[^\x20-\x7E\n]/g, "")  // remove weird characters
      .trim();
  }

  /* ===============================
     EXTRACT SECTIONS
  ================================ */
  static extractSections(text = "") {
    const sections = {
      contact: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
      projects: "",
    };

    if (!text) return sections;

    const lines = text.split("\n");
    let currentSection = null;

    for (const line of lines) {
      const lower = line.toLowerCase().trim();

      if (lower.startsWith("summary") || lower.startsWith("objective")) {
        currentSection = "summary";
        continue;
      }

      if (
        lower.startsWith("experience") ||
        lower.startsWith("work experience")
      ) {
        currentSection = "experience";
        continue;
      }

      if (lower.startsWith("education") || lower.startsWith("academic")) {
        currentSection = "education";
        continue;
      }

      if (lower.startsWith("skills") || lower.startsWith("technical skills")) {
        currentSection = "skills";
        continue;
      }

      if (lower.startsWith("projects")) {
        currentSection = "projects";
        continue;
      }

      if (
        lower.includes("email") ||
        lower.includes("phone") ||
        lower.includes("linkedin")
      ) {
        currentSection = "contact";
        continue;
      }

      if (currentSection) {
        sections[currentSection] += line + "\n";
      }
    }

    return sections;
  }
}

export default FileParser;

