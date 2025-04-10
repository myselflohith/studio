// Summarizes message analytics and earnings data using AI to provide key insights.
//
// - summarizeInsights - A function that generates a summary of insights.
// - SummarizeInsightsInput - The input type for the summarizeInsights function.
// - SummarizeInsightsOutput - The return type for the summarizeInsights function.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeInsightsInputSchema = z.object({
  messageAnalytics: z.object({
    totalSent: z.number().describe('Total number of messages sent.'),
    delivered: z.number().describe('Number of messages delivered.'),
    read: z.number().describe('Number of messages read.'),
    failed: z.number().describe('Number of messages failed.'),
    pending: z.number().describe('Number of messages pending.'),
  }).describe('Message analytics data.'),
  earningsData: z.object({
    today: z.number().describe('Total earnings today.'),
    yesterday: z.number().describe('Total earnings yesterday.'),
    thisMonth: z.number().describe('Total earnings this month.'),
  }).describe('Earnings data.'),
});
export type SummarizeInsightsInput = z.infer<typeof SummarizeInsightsInputSchema>;

const SummarizeInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key insights.'),
});
export type SummarizeInsightsOutput = z.infer<typeof SummarizeInsightsOutputSchema>;

export async function summarizeInsights(input: SummarizeInsightsInput): Promise<SummarizeInsightsOutput> {
  return summarizeInsightsFlow(input);
}

const summarizeInsightsPrompt = ai.definePrompt({
  name: 'summarizeInsightsPrompt',
  input: {
    schema: z.object({
      messageAnalytics: z.object({
        totalSent: z.number().describe('Total number of messages sent.'),
        delivered: z.number().describe('Number of messages delivered.'),
        read: z.number().describe('Number of messages read.'),
        failed: z.number().describe('Number of messages failed.'),
        pending: z.number().describe('Number of messages pending.'),
      }).describe('Message analytics data.'),
      earningsData: z.object({
        today: z.number().describe('Total earnings today.'),
        yesterday: z.number().describe('Total earnings yesterday.'),
        thisMonth: z.number().describe('Total earnings this month.'),
      }).describe('Earnings data.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the key insights.'),
    }),
  },
  prompt: `You are an AI assistant that summarizes key insights from message analytics and earnings data.

  Message Analytics:
  - Total Messages Sent: {{{messageAnalytics.totalSent}}}
  - Delivered: {{{messageAnalytics.delivered}}}
  - Read: {{{messageAnalytics.read}}}
  - Failed: {{{messageAnalytics.failed}}}
  - Pending: {{{messageAnalytics.pending}}}

  Earnings Data:
  - Today: {{{earningsData.today}}}
  - Yesterday: {{{earningsData.yesterday}}}
  - This Month: {{{earningsData.thisMonth}}}

  Provide a concise summary of the key insights from the above data. Focus on significant changes, trends, and potential issues.
  `,
});

const summarizeInsightsFlow = ai.defineFlow<
  typeof SummarizeInsightsInputSchema,
  typeof SummarizeInsightsOutputSchema
>({
  name: 'summarizeInsightsFlow',
  inputSchema: SummarizeInsightsInputSchema,
  outputSchema: SummarizeInsightsOutputSchema,
},
async input => {
  const {output} = await summarizeInsightsPrompt(input);
  return output!;
});
