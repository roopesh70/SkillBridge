// Job-matching flow to connect students with relevant job opportunities.
// This file exports the jobMatching function, JobMatchingInput type, and JobMatchingOutput type.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const JobMatchingInputSchema = z.object({
  studentProfile: z.string().describe('Student profile including skills, experience, and preferences.'),
  jobDescription: z.string().describe('Job description outlining requirements and responsibilities.'),
});
export type JobMatchingInput = z.infer<typeof JobMatchingInputSchema>;

const JobMatchingOutputSchema = z.object({
  matchScore: z.number().describe('A numerical score indicating the relevance of the job to the student (0-100).'),
  justification: z.string().describe('Explanation of why the job is a good match for the student.'),
});
export type JobMatchingOutput = z.infer<typeof JobMatchingOutputSchema>;

export async function jobMatching(input: JobMatchingInput): Promise<JobMatchingOutput> {
  return jobMatchingFlow(input);
}

const jobMatchingPrompt = ai.definePrompt({
  name: 'jobMatchingPrompt',
  input: {schema: JobMatchingInputSchema},
  output: {schema: JobMatchingOutputSchema},
  prompt: `You are an AI job matching expert. Given a student profile and a job description, determine how well the job matches the student.  Provide a matchScore from 0 to 100 and a justification for the score.  The justification should reference specific skills and experiences from the student profile that align with the job requirements. Be concise.

Student Profile:
{{{studentProfile}}}

Job Description:
{{{jobDescription}}}`, 
});

const jobMatchingFlow = ai.defineFlow(
  {
    name: 'jobMatchingFlow',
    inputSchema: JobMatchingInputSchema,
    outputSchema: JobMatchingOutputSchema,
  },
  async input => {
    const {output} = await jobMatchingPrompt(input);
    return output!;
  }
);
