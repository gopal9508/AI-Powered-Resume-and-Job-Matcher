import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  /* ===============================
     BASIC USER INFO
  ================================ */
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  /* ===============================
     RESUME DATA
  ================================ */
  resumeFile: {
    type: String,
    default: null,
  },

  resumeText: {
    type: String,
    default: null,
  },

  /* ===============================
     USER PREFERENCES
  ================================ */
  preferences: {
    jobTypes: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      default: [],
    },
    salaryRange: {
      min: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
    },
    industries: {
      type: [String],
      default: [],
    },
  },

  /* ===============================
     TIMESTAMPS (KEPT AS YOU WROTE)
  ================================ */
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/* ===============================
   HASH PASSWORD BEFORE SAVING
================================ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* ===============================
   COMPARE PASSWORD METHOD
================================ */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/* ===============================
   UPDATE TIMESTAMP ON SAVE
================================ */
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
