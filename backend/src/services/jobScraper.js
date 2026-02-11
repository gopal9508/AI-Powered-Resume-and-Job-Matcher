import axios from "axios";
import * as cheerio from "cheerio";

import Job from "../models/Job.js";

class JobScraper {
  constructor() {
    this.baseURLs = {
      linkedin: "https://www.linkedin.com/jobs/search/",
      naukri: "https://www.naukri.com/",
      instahire: "https://instahire.com/",
      indeed: "https://www.indeed.com/",
      glassdoor: "https://www.glassdoor.com/",
    };
  }

  async searchJobs(keywords, location = "", limit = 10) {
    try {
      // In a real implementation, you would:
      // 1. Use official APIs where available
      // 2. Implement proper web scraping with rate limiting
      // 3. Handle authentication for paid APIs

      // For now, return mock data or use a jobs API
      const jobs = await this.getMockJobs(keywords, location, limit);

      // Save to database
      await this.saveJobsToDB(jobs);

      return jobs;
    } catch (error) {
      console.error("Job Search Error:", error);
      throw new Error("Failed to search jobs");
    }
  }

  async getMockJobs(keywords, location, limit) {
    const mockJobs = [
      {
        title: `Senior ${keywords.split(" ")[0]} Developer`,
        company: "TechCorp Inc.",
        description: `Looking for experienced ${keywords} developer. Requirements include...`,
        location: location || "Remote",
        salary: { min: 120000, max: 150000, currency: "USD" },
        type: "full-time",
        platform: "linkedin",
        applyLink: "https://linkedin.com/jobs/view/123",
        requirements: [keywords, "JavaScript", "React", "Node.js"],
        skills: ["JavaScript", "React", "Node.js", "AWS"],
      },
      {
        title: `Full Stack ${keywords.split(" ")[0]} Engineer`,
        company: "Innovate Solutions",
        description: `Join our team as a Full Stack ${keywords} Engineer...`,
        location: location || "New York, NY",
        salary: { min: 110000, max: 140000, currency: "USD" },
        type: "full-time",
        platform: "naukri",
        applyLink: "https://naukri.com/job/456",
        requirements: [keywords, "Python", "Django", "React"],
        skills: ["Python", "Django", "React", "PostgreSQL"],
      },
    ];

    return mockJobs.slice(0, limit);
  }

  async saveJobsToDB(jobs) {
    try {
      for (const jobData of jobs) {
        await Job.findOneAndUpdate(
          { applyLink: jobData.applyLink },
          jobData,
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error("Save Jobs Error:", error);
    }
  }

  async scrapeLinkedinJobs(keywords, location) {
    try {
      const params = new URLSearchParams({
        keywords: keywords,
        location: location,
        f_TPR: "r86400",
        position: "1",
        pageNum: "0",
      });

      const url = `${this.baseURLs.linkedin}?${params.toString()}`;

      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      $(".base-search-card").each((index, element) => {
        const title = $(element)
          .find(".base-search-card__title")
          .text()
          .trim();
        const company = $(element)
          .find(".base-search-card__subtitle")
          .text()
          .trim();
        const location = $(element)
          .find(".job-search-card__location")
          .text()
          .trim();

        if (title && company) {
          jobs.push({
            title,
            company,
            location,
            platform: "linkedin",
          });
        }
      });

      return jobs;
    } catch (error) {
      console.error("LinkedIn Scraping Error:", error);
      return [];
    }
  }

  // Similar methods for other platforms...
}

export default new JobScraper();
