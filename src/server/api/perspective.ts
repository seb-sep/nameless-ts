import { TRPCError } from '@trpc/server';
import axios from 'axios';

const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

type attributeScore = {
  spanScores: {
    begin: number,
    end: number,
    score: {
      value: number,
      type: string
    }
  }[],
  summaryScore: {
    value: number,
    type: string
  }
}

type perspectiveOutput = {
  attributeScores: {
    TOXICITY: attributeScore,
    IDENTITY_ATTACK: attributeScore,
    INSULT: attributeScore,
    THREAT: attributeScore,
  }
  languages: string[];
  detectedLanguages: string[];
}

/**
 * Send a piece of text off to Google's Perspective API to analyze for malicious content.
 * @param text the text to analyze
 * @returns true if any attributes such as TOXICITY return a summary score of >0.7, false if otherwise
 */
export async function analyzeText(text: string): Promise<boolean> {
  if (!process.env.PERSPECTIVE_API_KEY) {
    throw new Error("No API key for Perspective");
  }
  try {
    const response = await axios.post<perspectiveOutput>(
      PERSPECTIVE_API_URL,
      {
        comment: { text },
        requestedAttributes: { TOXICITY: {}, IDENTITY_ATTACK: {}, INSULT: {}, THREAT: {} },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          key: process.env.PERSPECTIVE_API_KEY,
        },
      }
    );

    const attrs = Object.values(response.data.attributeScores);

    //Iterate through all attributes and check if any have a score of over 0.7
    return (attrs.filter((attr) => attr.summaryScore.value > 0.7).length > 0)  
    
  } catch (error) {
    console.error(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to analyze text"
    });
  }
}
