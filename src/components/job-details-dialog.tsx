"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiMatchDisplay } from "./ai-match-display";
import type { Job } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { applyForJob, getUserData, type UserData } from "@/lib/user-service";
import { useEffect, useState } from "react";

interface JobDetailsDialogProps {
  job: Job;
  studentProfile: string;
  isSaved: boolean;
  onSaveToggle: (jobId: number) => void;
  isLoggedIn: boolean;
}

export function JobDetailsDialog({ job, studentProfile, isSaved, onSaveToggle, isLoggedIn }: JobDetailsDialogProps) {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
      const fetchUserData = async () => {
          setLoading(true);
          if (user) {
              const data = await getUserData(user.uid);
              setUserData(data);
          }
          setLoading(false);
      }
      if (!authLoading) {
        fetchUserData();
      }
  }, [user, authLoading]);

  const handleApply = async () => {
    if (!user) {
       toast({
        title: "Please log in",
        description: "You need to be logged in to apply for jobs.",
        variant: "destructive"
      });
      return;
    }
    setIsApplying(true);
    const originalUserData = userData;

    // Optimistic UI update
    setUserData(prev => {
        if (!prev) return null;
        return { ...prev, appliedJobs: [...prev.appliedJobs, job.id] };
    });

    try {
      await applyForJob(user.uid, job.id);
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} has been sent.`,
      });
    } catch(e) {
      // Revert on error
      setUserData(originalUserData);
       toast({
        title: "Application Failed",
        description: "There was an error submitting your application.",
        variant: "destructive"
      });
    } finally {
        setIsApplying(false);
    }
  };

  const hasApplied = userData?.appliedJobs.includes(job.id) || false;

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
        <DialogDescription className="text-primary font-medium text-lg">{job.company}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground space-x-6">
          <div className="flex items-center">
            <Icons.mapPin className="mr-1.5 h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Icons.clock className="mr-1.5 h-4 w-4" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center">
            <Icons.star className="mr-1.5 h-4 w-4" />
            <span>{job.rating} ({job.reviewCount} reviews)</span>
          </div>
        </div>
        <Separator />
        <div>
            <h4 className="font-semibold mb-2">Job Description</h4>
            <p className="text-sm text-muted-foreground">{job.description}</p>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
            </div>
        </div>
        <Separator />
         <div className="w-full">
            <AiMatchDisplay jobDescription={job.description} studentProfile={studentProfile} isLoggedIn={isLoggedIn} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSaveToggle(job.id)}>
          <Icons.star className={cn("mr-2 h-4 w-4", isSaved ? "text-yellow-400 fill-yellow-400" : "")} />
          {isSaved ? 'Saved' : 'Save Job'}
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleApply} disabled={hasApplied || isApplying || loading || authLoading}>
            {hasApplied ? 'Applied' : (isApplying ? 'Submitting...' : 'Apply Now')}
        </Button>
      </div>
    </DialogContent>
  );
}
