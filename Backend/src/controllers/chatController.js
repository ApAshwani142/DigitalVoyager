import "dotenv/config";
import axios from "axios";

const rawKey = (process.env.GEMINI_API_KEY || "").trim().replace(/['"]/g, "");

if (!rawKey) {
  console.warn("GEMINI_API_KEY is missing. Chatbot will not work until configured.");
} else {
  console.log("GEMINI_API_KEY loaded");
}

let cachedModelName = null;

const findWorkingModel = async () => {
  if (cachedModelName) {
    return cachedModelName;
  }

  const modelsToTry = [
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "gemini-3-flash-preview",
    "gemini-3-pro-preview",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

  for (const modelName of modelsToTry) {
    const variations = [modelName, `models/${modelName}`];

    for (const modelVar of variations) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelVar}:generateContent?key=${rawKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: "test",
                  },
                ],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          cachedModelName = modelName;
          console.log(`Found working model: ${modelVar}`);
          return modelName;
        }
      } catch (testError) {
        const status = testError.response?.status;
        if (status !== 404) {
          const errorMsg =
            testError.response?.data?.error?.message || testError.message;
          console.log(`Model ${modelVar} failed: ${errorMsg}`);
        }

        if (modelVar === variations[1]) {
          break;
        }
        continue;
      }
    }
  }

  console.log("No working model found, defaulting to gemini-2.5-pro");
  return "gemini-2.5-pro";
};

export const chatWithGemini = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!rawKey) {
      return res
        .status(500)
        .json({ error: "Gemini API key is not configured on the server." });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `You are the Digital Voyager / CyberScope Forensics website assistant.
You help users understand our digital forensics, incident response, cybersecurity consulting,
training services, and how to contact us.

Guidelines:
- Answer only about topics relevant to digital forensics, cybersecurity, incident response,
  our services, contact options, and how we work.
- If a user asks about unrelated topics, politely say it's outside your scope and redirect
  them to our services or contact options.
- Keep answers short, clear, and friendly.
- When helpful, remind users they can use the Contact page, emergency hotline for urgent
  incidents, or request a consultation.`;

    const trimmedHistory = history
      .slice(-6)
      .map((h) => {
        if (h.user) return `User: ${h.user}`;
        if (h.bot) return `Assistant: ${h.bot}`;
        return "";
      })
      .filter(Boolean)
      .join("\n");

    const fullPrompt = `${systemPrompt}

Conversation so far:
${trimmedHistory}

New user question: ${message}`;

    const modelName = await findWorkingModel();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${rawKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;

    console.log(`Response generated using model: ${modelName}`);
    return res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("Gemini chat error:", error?.message || error);

    if (cachedModelName) {
      console.log(`Clearing cached model ${cachedModelName} due to error`);
      cachedModelName = null;
    }

    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Gemini API Error";

    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return res.status(500).json({
        error:
          "Gemini model not found. Please check your API key configuration.",
      });
    }

    if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      return res.status(500).json({
        error: "API key authentication failed. Please verify your GEMINI_API_KEY is correct.",
      });
    }

    return res.status(500).json({ error: "Gemini API Error: " + errorMessage });
  }
};

export const testGeminiConnection = async (req, res) => {
  try {
    if (!rawKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
        fix: "Add GEMINI_API_KEY to your Backend/.env file",
      });
    }

    const testResults = {
      apiKeyLoaded: true,
      apiKeyLength: rawKey.length,
      apiKeyPrefix: rawKey.slice(0, 4),
      modelsTested: [],
      workingModel: null,
      errors: [],
    };

    const modelsToTest = [
      "gemini-2.5-pro",
      "gemini-flash-latest",
      "gemini-3-flash-preview",
      "gemini-3-pro-preview",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];

    for (const modelName of modelsToTest) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${rawKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: "Hello",
                  },
                ],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          testResults.modelsTested.push({
            name: modelName,
            status: "Working",
            response:
              response.data.candidates[0].content.parts[0].text.substring(0, 50) +
              "...",
          });

          if (!testResults.workingModel) {
            testResults.workingModel = modelName;
          }
        }
      } catch (modelError) {
        const status = modelError.response?.status;
        const errorMsg =
          modelError.response?.data?.error?.message || modelError.message;
        testResults.modelsTested.push({
          name: modelName,
          status: "Failed",
          error: `${status}: ${errorMsg}`,
        });
        testResults.errors.push(`${modelName}: ${errorMsg}`);
      }
    }

    if (testResults.workingModel) {
      return res.status(200).json({
        success: true,
        message: `API key is valid! Working model: ${testResults.workingModel}`,
        ...testResults,
      });
    } else {
      return res.status(500).json({
        success: false,
        message:
          "No working models found. Your API key may not have access to Gemini models.",
        fix: "Check your Google AI Studio settings and API key permissions.",
        ...testResults,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      fix: "Check your GEMINI_API_KEY in Backend/.env file",
    });
  }
};
