'use server';

import { jobMatching, type JobMatchingInput, type JobMatchingOutput } from '@/ai/flows/job-matcher';

export async function getMatchDetails(input: JobMatchingInput): Promise<JobMatchingOutput> {
  try {
    // If there's no student profile, no need to call the AI.
    if (!input.studentProfile) {
      return {
        matchScore: 0,
        justification: "Log in and complete your profile to see your AI match score.",
      }
    }
    const result = await jobMatching(input);
    return result;
  } catch (error: any) {
    console.error("Error in AI job matching:", error);
    
    // Check if it's a permission error and provide a specific message.
    if (error.status === 403) {
      return {
        matchScore: 0,
        justification: "The AI matching feature is not available at the moment. Please try again later.",
      };
    }

    // Return a generic error-state output for other issues.
    return {
      matchScore: 0,
      justification: "Could not determine match score due to an error.",
    };
  }
}
