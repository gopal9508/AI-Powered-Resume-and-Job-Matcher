const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

class ResumeParser {
  static async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      
      // Extract structured data
      const structuredData = this.extractStructuredData(data.text);
      
      return {
        success: true,
        text: data.text,
        metadata: {
          ...data.metadata,
          numPages: data.numpages,
          textLength: data.text.length
        },
        structured: structuredData
      };
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  static async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      const structuredData = this.extractStructuredData(result.value);
      
      return {
        success: true,
        text: result.value,
        metadata: {
          messages: result.messages,
          textLength: result.value.length
        },
        structured: structuredData
      };
    } catch (error) {
      throw new Error(`DOCX parsing failed: ${error.message}`);
    }
  }

  static extractStructuredData(text) {
    const lines = text.split('\n');
    const structured = {
      contact: {},
      summary: '',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
      languages: []
    };

    let currentSection = null;
    let sectionContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;

      // Detect sections
      const lowerLine = line.toLowerCase();
      
      if (this.isContactLine(lowerLine)) {
        this.parseContactInfo(line, structured.contact);
      } else if (this.isSectionHeader(lowerLine, 'experience')) {
        this.startNewSection('experience', structured, sectionContent, currentSection);
        currentSection = 'experience';
        sectionContent = [];
      } else if (this.isSectionHeader(lowerLine, 'education')) {
        this.startNewSection('education', structured, sectionContent, currentSection);
        currentSection = 'education';
        sectionContent = [];
      } else if (this.isSectionHeader(lowerLine, 'skill')) {
        this.startNewSection('skills', structured, sectionContent, currentSection);
        currentSection = 'skills';
        sectionContent = [];
      } else if (this.isSectionHeader(lowerLine, 'summary') || 
                 this.isSectionHeader(lowerLine, 'objective') ||
                 this.isSectionHeader(lowerLine, 'profile')) {
        this.startNewSection('summary', structured, sectionContent, currentSection);
        currentSection = 'summary';
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      }
    }

    // Process final section
    if (currentSection && sectionContent.length > 0) {
      this.processSectionContent(currentSection, structured, sectionContent);
    }

    return structured;
  }

  static isContactLine(line) {
    const contactPatterns = [
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, // Email
      /^(\+\d{1,3}[- ]?)?\d{10}$/, // Phone
      /^linkedin\.com\/in\/\w+/, // LinkedIn
      /^github\.com\/\w+/, // GitHub
      /^https?:\/\//, // Website
      /^(www\.)/ // Website without protocol
    ];

    return contactPatterns.some(pattern => pattern.test(line));
  }

  static parseContactInfo(line, contactObj) {
    if (line.includes('@') && line.includes('.')) {
      contactObj.email = line;
    } else if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(line.replace(/[\s\-()]/g, ''))) {
      contactObj.phone = line;
    } else if (line.includes('linkedin.com')) {
      contactObj.linkedin = line;
    } else if (line.includes('github.com')) {
      contactObj.github = line;
    } else if (line.startsWith('http') || line.startsWith('www.')) {
      contactObj.website = line.startsWith('http') ? line : `https://${line}`;
    }
  }

  static isSectionHeader(line, sectionName) {
    const patterns = {
      experience: [/experience/, /work history/, /employment history/],
      education: [/education/, /academic/, /qualification/],
      skills: [/skill/, /technical skill/, /competence/],
      summary: [/summary/, /objective/, /profile/, /about me/],
      certifications: [/certification/, /license/, /course/],
      projects: [/project/, /portfolio/],
      languages: [/language/, /bilingual/]
    };

    return patterns[sectionName]?.some(pattern => pattern.test(line));
  }

  static startNewSection(newSection, structured, sectionContent, currentSection) {
    if (currentSection && sectionContent.length > 0) {
      this.processSectionContent(currentSection, structured, sectionContent);
    }
  }

  static processSectionContent(section, structured, content) {
    const text = content.join('\n');
    
    switch (section) {
      case 'summary':
        structured.summary = text;
        break;
      case 'skills':
        // Extract skills (comma separated, bullet points, etc.)
        const skills = text.split(/[,•\-*]\s*/)
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);
        structured.skills = skills;
        break;
      case 'experience':
        // Simple experience extraction - can be enhanced
        structured.experience.push({
          text: text,
          parsed: this.parseExperience(text)
        });
        break;
      case 'education':
        structured.education.push({
          text: text,
          parsed: this.parseEducation(text)
        });
        break;
      default:
        if (structured[section]) {
          structured[section].push(text);
        }
    }
  }

  static parseExperience(text) {
    // Enhanced experience parsing logic
    const lines = text.split('\n');
    const experience = {
      title: '',
      company: '',
      duration: '',
      location: '',
      description: []
    };

    for (const line of lines) {
      if (!experience.title && line.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/)) {
        experience.title = line;
      } else if (!experience.company && (line.includes(' at ') || line.includes(',') || line.includes(' - '))) {
        experience.company = line;
      } else if (!experience.duration && line.match(/\d{4}.*\d{4}|present|current|[\w]+\s+\d{4}/i)) {
        experience.duration = line;
      } else {
        experience.description.push(line);
      }
    }

    return experience;
  }

  static parseEducation(text) {
    // Enhanced education parsing logic
    const lines = text.split('\n');
    const education = {
      degree: '',
      institution: '',
      year: '',
      grade: ''
    };

    for (const line of lines) {
      if (!education.degree && line.match(/(bachelor|master|phd|diploma|certificate)/i)) {
        education.degree = line;
      } else if (!education.institution && line.match(/university|college|institute|school/i)) {
        education.institution = line;
      } else if (!education.year && line.match(/\d{4}/)) {
        education.year = line;
      } else if (!education.grade && line.match(/gpa|grade|score|percentage/i)) {
        education.grade = line;
      }
    }

    return education;
  }

  static async parseFile(buffer, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case 'pdf':
          return await this.parsePDF(buffer);
        case 'docx':
        case 'doc':
          return await this.parseDOCX(buffer);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      throw new Error(`File parsing failed: ${error.message}`);
    }
  }
}

module.exports = ResumeParser;