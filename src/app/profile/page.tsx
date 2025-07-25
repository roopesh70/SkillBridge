"use client";

import { StudentProfileCard } from "@/components/student-profile-card";
import { jobs } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { getUserData, type UserData } from "@/lib/user-service";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditProfileDialog } from "@/components/edit-profile-dialog";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const fetchUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
        setLoading(true);
        fetchUserData();
    }
  }, [user, authLoading]);

  const handleProfileUpdate = () => {
    setLoading(true);
    fetchUserData(); // Refetch user data after update
  }

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
  
  if (!userData) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p>Could not load user profile.</p>
        </div>
    )
  }

  const savedJobsList = jobs.filter(job => userData?.savedJobs.includes(job.id));
  const appliedJobsList = jobs.filter(job => userData?.appliedJobs.includes(job.id));

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="relative">
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="absolute top-4 right-4" variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <EditProfileDialog user={userData} onProfileUpdate={handleProfileUpdate} closeDialog={() => setEditDialogOpen(false)}/>
            </Dialog>
            <StudentProfileCard student={userData} />
        </div>
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
