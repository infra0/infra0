import { config } from "../../config";
import { CLAUDE_MODELS, GEMINI_MODELS, LLMProvider } from "../llm";

export const getPreferredLLMConfig = (): {
  provider: LLMProvider;
  model: CLAUDE_MODELS | GEMINI_MODELS;
} => {
  if (config.anthropicApiKey) {
    console.log("ANTHROPIC_API_KEY found, using ANTHROPIC.");
    return {
      provider: LLMProvider.ANTHROPIC,
      model: CLAUDE_MODELS.SONNET_4,
    };
  } else if (config.googleApiKey) {
    console.log("GOOGLE_GENERATIVE_AI_API_KEY found, using GEMINI.");
    return {
      provider: LLMProvider.GOOGLE,
      model: GEMINI_MODELS.GEMINI_2_FLASH,
    };
  } else {
    console.warn(
      "No model provider configured, defaulting to ANTHROPIC. Please set ANTHROPIC_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY."
    );
    return {
      provider: LLMProvider.ANTHROPIC,
      model: CLAUDE_MODELS.SONNET_4,
    };
  }
};
