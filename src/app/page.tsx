"use client";

import { JobCard } from "@/components/job-card";
import { jobs, studentProfile } from "@/lib/data";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserData, saveJob, unsaveJob, type UserData } from "@/lib/user-service";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const studentProfileString = `Skills: ${studentProfile.skills.join(', ')}; Experience: ${studentProfile.experience.map(e => `${e.title} at ${e.company}`).join('; ')}; Preferences: flexible schedule, remote work.`;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        const data = await getUserData(user.uid);
        setUserData(data);
        setLoading(false);
      } else if (!authLoading) {
        setLoading(false);
        setUserData(null); // Clear user data on logout
      }
    };
    fetchUserData();
  }, [user, authLoading]);

  const handleSaveToggle = async (jobId: number) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save jobs.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    const isSaved = userData?.savedJobs.includes(jobId);

    try {
      if (isSaved) {
        await unsaveJob(user.uid, jobId);
        setUserData(prev => prev ? { ...prev, savedJobs: prev.savedJobs.filter(id => id !== jobId) } : null);
      } else {
        await saveJob(user.uid, jobId);
        setUserData(prev => prev ? { ...prev, savedJobs: [...prev.savedJobs, jobId] } : { savedJobs: [jobId], appliedJobs: [] });
      }
    } catch (error) {
        console.error("Error toggling save state:", error);
         toast({
            title: "Error",
            description: "Could not update saved jobs.",
            variant: "destructive"
        });
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            isSaved={userData?.savedJobs.includes(job.id) || false}
            onSaveToggle={handleSaveToggle}
          />
        ))}
      </div>
    </div>
  );
}
