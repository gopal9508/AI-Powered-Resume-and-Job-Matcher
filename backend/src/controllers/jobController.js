import Job from "../models/Job.js";

/* =====================================================
   @desc    Get all jobs (with filters & pagination)
   @route   GET /api/jobs
   @access  Public
===================================================== */
export const getJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      type,
      platform,
      minSalary,
      maxSalary,
    } = req.query;

    /* ===============================
       BUILD FILTER OBJECT
    ================================ */
    const filter = { isActive: true };

    // 🔍 Search (TEXT + REGEX fallback)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (platform) {
      filter.platform = platform;
    }

    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    /* ===============================
       PAGINATION
    ================================ */
    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const skip = (pageNumber - 1) * pageLimit;

    /* ===============================
       FETCH JOBS
    ================================ */
    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(pageLimit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageLimit),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Get job by ID
   @route   GET /api/jobs/:id
   @access  Public
===================================================== */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Search jobs by keywords (UPDATED – LENIENT)
   @route   POST /api/jobs/search
   @access  Public
===================================================== */
export const searchJobs = async (req, res, next) => {
  try {
    const { keywords = "", location = "", limit = 20 } = req.body;

    const searchFilter = { isActive: true };

    // 🔍 Keyword search (REGEX instead of strict $text)
    if (keywords) {
      searchFilter.$or = [
        { title: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } },
        { skills: { $regex: keywords, $options: "i" } },
      ];
    }

    // 📍 Location filter (optional)
    if (location) {
      searchFilter.location = { $regex: location, $options: "i" };
    }

let jobs = await Job.find(searchFilter)
  .sort({ postedDate: -1 })
  .limit(Number(limit));


    /* ===============================
       FALLBACK: show recent jobs
    ================================ */
    if (jobs.length === 0) {
      jobs = await Job.find({ isActive: true })
        .sort({ postedDate: -1 })
        .limit(Number(limit));
    }

 res.status(200).json({
  success: true,
  count: jobs.length,
  data: jobs,
});


  } catch (error) {
    next(error);
  }
};

/* =====================================================
   @desc    Refresh job listings (admin only)
   @route   POST /api/jobs/refresh
   @access  Private/Admin
===================================================== */
export const refreshJobs = async (req, res, next) => {
  try {
    // Future: trigger jobScraper service (LinkedIn, Naukri, etc.)
    // Currently mocked for stability

    res.status(200).json({
      success: true,
      message: "Job refresh initiated successfully",
      initiatedBy: req.user ? req.user.id : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
