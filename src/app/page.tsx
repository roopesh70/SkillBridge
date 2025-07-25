"use client";

import { JobCard } from "@/components/job-card";
import { jobs, studentProfile } from "@/lib/data";
import { useState } from "react";

export default function Home() {
  const studentProfileString = `Skills: ${studentProfile.skills.join(', ')}; Experience: ${studentProfile.experience.map(e => `${e.title} at ${e.company}`).join('; ')}; Preferences: flexible schedule, remote work.`;
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const handleSaveToggle = (jobId: number) => {
    setSavedJobs(prev => {
      const newSavedJobs = new Set(prev);
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
      } else {
        newSavedJobs.add(jobId);
      }
      return newSavedJobs;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Find Your Next Opportunity</h1>
        <p className="text-lg text-muted-foreground mt-2">Connecting talented students with innovative companies.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            studentProfile={studentProfileString} 
            isSaved={savedJobs.has(job.id)}
            onSaveToggle={handleSaveToggle}
          />
        ))}
      </div>
    </div>
  );
}
