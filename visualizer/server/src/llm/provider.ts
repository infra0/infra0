import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import {
  CLAUDE_MODELS,
  GEMINI_MODELS,
  LLMProvider,
  type InitialModelPayload,
} from "./types";
import { config } from "../../config";
import { AppError } from "../errors/app-error";
import httpStatus from "http-status";

export async function initModel({
  provider,
  model,
}: InitialModelPayload): Promise<{ model: any }> {
  console.log(`Initializing model for provider: ${provider}, model: ${model}`);

  switch (provider) {
    case LLMProvider.ANTHROPIC:
      const anthropicModel = getAnthropicProvider(model as CLAUDE_MODELS);
      return {
        model: anthropicModel,
      };
    case LLMProvider.GOOGLE:
      const googleModel = getGoogleProvider(model as GEMINI_MODELS);
      return {
        model: googleModel,
      };
    default:
      console.error("Unsupported provider:", provider);
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

function getAnthropicProvider(model: CLAUDE_MODELS) {
  if (!config.anthropicApiKey) {
    throw new AppError(
      "ANTHROPIC_API_KEY must be set",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  try {
    const modelInstance = anthropic(model);
    return modelInstance;
  } catch (error) {
    console.error("Error creating anthropic model:", error);
    throw error;
  }
}

// Future providers can be added here:
//
// import { openai } from '@ai-sdk/openai';
// import { google } from '@ai-sdk/google';
//
// case LLMProvider.OPENAI:
//     return { model: getOpenAIProvider(model) };
// case LLMProvider.GOOGLE:
//     return { model: getGoogleProvider(model) };
//
// function getOpenAIProvider(model: OPENAI_MODELS) {
//     if (!process.env.OPENAI_API_KEY) {
//         throw new Error('OPENAI_API_KEY must be set');
//     }
//     return openai(model);
// }
//
function getGoogleProvider(model: GEMINI_MODELS) {
  if (!config.googleApiKey) {
    throw new AppError(
      "GOOGLE_GENERATIVE_AI_API_KEY must be set",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  try {
    const modelInstance = google(model);
    return modelInstance;
  } catch (error) {
    console.error("Error creating Google model:", error);
    throw error;
  }
}
