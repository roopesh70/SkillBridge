
import type { Job } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { JobDetailsDialog } from "./job-details-dialog";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  studentProfile: string;
  isSaved: boolean;
  onSaveToggle: (jobId: number) => void;
  isLoggedIn: boolean;
}

export function JobCard({ job, studentProfile, isSaved, onSaveToggle, isLoggedIn }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
            <CardDescription className="text-primary font-medium">{job.company}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onSaveToggle(job.id)} className="shrink-0">
            <Icons.star className={cn("h-5 w-5", isSaved ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
          <div className="flex items-center">
            <Icons.mapPin className="mr-1.5 h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Icons.clock className="mr-1.5 h-4 w-4" />
            <span>{job.type}</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </CardContent>
      <Separator className="my-4"/>
      <CardFooter className="flex flex-col items-start gap-4">
         <div className="text-sm text-muted-foreground w-full">
            {isLoggedIn ? 'View details for AI Match Score' : 'Log in to see your AI Match Score'}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
          </DialogTrigger>
          <JobDetailsDialog job={job} studentProfile={studentProfile} isSaved={isSaved} onSaveToggle={onSaveToggle} isLoggedIn={isLoggedIn} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
