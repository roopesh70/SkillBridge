import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebaseConfig} from '@/lib/firebase';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: firebaseConfig.apiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
