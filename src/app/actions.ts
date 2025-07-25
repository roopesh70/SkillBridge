'use server';

import { jobMatching, type JobMatchingInput, type JobMatchingOutput } from '@/ai/flows/job-matcher';

export async function getMatchDetails(input: JobMatchingInput): Promise<JobMatchingOutput> {
  try {
    const result = await jobMatching(input);
    return result;
  } catch (error) {
    console.error("Error in AI job matching:", error);
    // Return a default error-state output
    return {
      matchScore: 0,
      justification: "Could not determine match score due to an error.",
    };
  }
}
