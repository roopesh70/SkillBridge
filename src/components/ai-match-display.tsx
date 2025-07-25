"use client";

import { useEffect, useState } from "react";
import { getMatchDetails } from "@/app/actions";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";
import { type JobMatchingOutput } from "@/ai/flows/job-matcher";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface AiMatchDisplayProps {
  jobDescription: string;
  studentProfile: string;
}

export function AiMatchDisplay({ jobDescription, studentProfile }: AiMatchDisplayProps) {
  const [matchData, setMatchData] = useState<JobMatchingOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatchData() {
      setLoading(true);
      const data = await getMatchDetails({ jobDescription, studentProfile });
      setMatchData(data);
      setLoading(false);
    }
    fetchMatchData();
  }, [jobDescription, studentProfile]);

  if (loading) {
    return (
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!matchData) {
    return <p className="text-sm text-destructive">Could not load match data.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">AI Match Score</span>
        <span className="text-sm font-bold text-primary">{matchData.matchScore}%</span>
      </div>
      <Progress value={matchData.matchScore} className="h-2" />
      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-sm py-2 hover:no-underline text-muted-foreground">View Justification</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">{matchData.justification}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
