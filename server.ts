import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const STORE_FILE = path.join(process.cwd(), "data", "server_store.json");

interface UserAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  schoolName: string;
  targetBoardYear: string;
  targetExamName: string;
  boardExamDate: string;
  dailyStudyGoalMinutes: number;
  avatarEmoji: string;
  createdAt: string;
}

interface UserStore {
  accounts: Record<string, UserAccount>;
  userData: Record<string, any>;
}

const DEFAULT_PUSHPAM_ACCOUNT: UserAccount = {
  id: "user-pushpam-kumar",
  email: "sarojkrsuman1976@gmail.com",
  password: "SarojKr@1234",
  name: "Pushpam Kumar",
  schoolName: "Delhi Public School",
  targetBoardYear: "2027",
  targetExamName: "Board Finals 2027",
  boardExamDate: "2027-02-15",
  dailyStudyGoalMinutes: 180,
  avatarEmoji: "🎓",
  createdAt: new Date().toISOString()
};

function readStore(): UserStore {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      const initial: UserStore = {
        accounts: {
          [DEFAULT_PUSHPAM_ACCOUNT.email.toLowerCase()]: DEFAULT_PUSHPAM_ACCOUNT
        },
        userData: {}
      };
      const dir = path.dirname(STORE_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(STORE_FILE, "utf-8");
    const parsed: UserStore = JSON.parse(content);
    if (!parsed.accounts) parsed.accounts = {};
    if (!parsed.userData) parsed.userData = {};
    if (!parsed.accounts[DEFAULT_PUSHPAM_ACCOUNT.email.toLowerCase()]) {
      parsed.accounts[DEFAULT_PUSHPAM_ACCOUNT.email.toLowerCase()] = DEFAULT_PUSHPAM_ACCOUNT;
    } else {
      parsed.accounts[DEFAULT_PUSHPAM_ACCOUNT.email.toLowerCase()].password = DEFAULT_PUSHPAM_ACCOUNT.password;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading server store:", err);
    return {
      accounts: {
        [DEFAULT_PUSHPAM_ACCOUNT.email.toLowerCase()]: DEFAULT_PUSHPAM_ACCOUNT
      },
      userData: {}
    };
  }
}

function writeStore(store: UserStore) {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error("Error writing server store:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Initialize Gemini AI Client lazily or safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Accounts List API
  app.get("/api/auth/accounts", (_req, res) => {
    const store = readStore();
    const accounts = Object.values(store.accounts).map(({ password, ...user }) => user);
    res.json({ accounts });
  });

  // Login API
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const store = readStore();
      const emailKey = String(email).trim().toLowerCase();
      const account = store.accounts[emailKey];

      if (!account) {
        return res.status(404).json({ error: "No account found with this email. Please click 'Create Student Account' to register first." });
      }

      if (account.password && account.password !== String(password).trim()) {
        return res.status(401).json({ error: "Incorrect password. Please check your password or reset it." });
      }

      const userData = store.userData[emailKey] || null;
      res.json({ success: true, user: account, userData });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(500).json({ error: err?.message || "Failed to log in" });
    }
  });

  // Register API
  app.post("/api/auth/register", (req, res) => {
    try {
      const { email, password, name, schoolName, targetBoardYear, targetExamName, boardExamDate, dailyStudyGoalMinutes, avatarEmoji } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      const store = readStore();
      const emailKey = String(email).trim().toLowerCase();

      if (store.accounts[emailKey]) {
        return res.status(400).json({ error: "An account with this email address already exists. Please Sign In." });
      }

      const newAccount: UserAccount = {
        id: "user-" + Date.now(),
        email: String(email).trim(),
        password: String(password).trim(),
        name: String(name).trim(),
        schoolName: schoolName ? String(schoolName).trim() : "Delhi Public School",
        targetBoardYear: targetBoardYear || "2027",
        targetExamName: targetExamName || `Board Finals ${targetBoardYear || 2027}`,
        boardExamDate: boardExamDate || "2027-02-15",
        dailyStudyGoalMinutes: dailyStudyGoalMinutes || 180,
        avatarEmoji: avatarEmoji || "🎓",
        createdAt: new Date().toISOString()
      };

      store.accounts[emailKey] = newAccount;
      writeStore(store);

      res.json({ success: true, user: newAccount });
    } catch (err: any) {
      console.error("Register error:", err);
      res.status(500).json({ error: err?.message || "Failed to register account" });
    }
  });

  // Get User Data API
  app.post("/api/sync/get-user-data", (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const store = readStore();
      const emailKey = String(email).trim().toLowerCase();
      const userData = store.userData[emailKey] || null;
      res.json({ success: true, userData });
    } catch (err: any) {
      console.error("Get user data error:", err);
      res.status(500).json({ error: err?.message || "Failed to get user data" });
    }
  });

  // Save User Data API
  app.post("/api/sync/save-user-data", (req, res) => {
    try {
      const { email, data } = req.body;
      if (!email || !data) {
        return res.status(400).json({ error: "Email and data payload are required" });
      }

      const store = readStore();
      const emailKey = String(email).trim().toLowerCase();

      store.userData[emailKey] = {
        ...store.userData[emailKey],
        ...data,
        updatedAt: new Date().toISOString()
      };

      writeStore(store);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Save user data error:", err);
      res.status(500).json({ error: err?.message || "Failed to save user data" });
    }
  });

  // API to generate custom practice MCQs for weak chapters
  app.post("/api/gemini/generate-quiz", async (req, res) => {
    try {
      const { subject, chapterName, count = 5 } = req.body;
      const ai = getAi();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured in server environment.",
        });
      }

      const prompt = `Generate ${count} high-quality, concept-testing multiple choice questions (MCQs and Assertion-Reasoning) for 10th grade student for the Subject: "${subject}", Chapter: "${chapterName}".

STRICT CONTENT & FORMATTING RULES:
1. Every question MUST test actual subject matter (e.g. chemical reactions, physics formulas, math equations, biological mechanisms, historical dates/events, grammar/literary analysis).
2. DO NOT include meta phrases like "According to CBSE framework", "NCERT guidelines", "Option A is a valid principle", "under board criteria", or exam strategy advice.
3. Every question must have 4 distinct, plausible options (A, B, C, D) and 1 correct answer index (0, 1, 2, or 3).
4. Provide a clear, step-by-step conceptual explanation explaining why the correct answer is right and why other options are incorrect.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert 10th grade master educator and subject specialist in Science, Mathematics, Social Science, and Literature. Create clear, challenging, pure subject conceptual questions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, description: "mcq or assertion_reason" },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswer: { type: Type.INTEGER, description: "0-based index of correct option (0 to 3)" },
                    explanation: { type: Type.STRING },
                  },
                  required: ["id", "question", "options", "correctAnswer", "explanation"],
                },
              },
            },
            required: ["questions"],
          },
        },
      });

      const jsonText = response.text || "{}";
      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini quiz generation error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate AI quiz" });
    }
  });

  // API to answer student doubts or explain weak chapter concepts
  app.post("/api/gemini/explain", async (req, res) => {
    try {
      const { topic, questionText, studentQuery } = req.body;
      const ai = getAi();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured.",
        });
      }

      const prompt = `You are a friendly CBSE Class 10 mentor. Explain the following concept or solve the doubt clearly for a 10th grade student:
Topic/Chapter: ${topic || "CBSE Class 10"}
Question: ${questionText || ""}
Student Query: ${studentQuery}

Provide:
1. Simple explanation with analogies or NCERT key formulas
2. Important CBSE Board Exam tips / Common mistakes to avoid
3. 1 short summary mnemonic or key takeaway`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (err: any) {
      console.error("Gemini explanation error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate explanation" });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
