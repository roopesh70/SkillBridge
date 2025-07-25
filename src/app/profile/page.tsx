"use client";

import { StudentProfileCard } from "@/components/student-profile-card";
import { jobs, studentProfile } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { getUserData, type UserData } from "@/lib/user-service";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
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
        // Not logged in
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, authLoading]);


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p>Please log in to view your profile.</p>
            <Link href="/login">
                <Button className="mt-4">Login</Button>
            </Link>
        </div>
    )
  }

  const savedJobsList = jobs.filter(job => userData?.savedJobs.includes(job.id));
  const appliedJobsList = jobs.filter(job => userData?.appliedJobs.includes(job.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentProfileCard student={studentProfile} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                {savedJobsList.length > 0 ? (
                    <ul className="space-y-2">
                        {savedJobsList.map(job => <li key={job.id}>{job.title} at {job.company}</li>)}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">You have no saved jobs.</p>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Applied Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                 {appliedJobsList.length > 0 ? (
                    <ul className="space-y-2">
                        {appliedJobsList.map(job => <li key={job.id}>{job.title} at {job.company}</li>)}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">You have not applied for any jobs.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
