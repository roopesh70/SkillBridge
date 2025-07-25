
"use client";

import { StudentProfileCard } from "@/components/student-profile-card";
import { jobs } from "@/lib/data";
import { useEffect, useState } from "react";
import { updateUserProfile, uploadProfilePhoto } from "@/lib/user-service";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { UserData } from "@/lib/user-service";

export default function ProfilePage() {
  const { user, userData, loading, fetchUserData, setUserData } = useUser();
  const { toast } = useToast();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const handleProfileUpdate = async (updatedData: Partial<UserData>, avatarFile: File | null) => {
    if (!user || !userData) return;
    
    setIsUpdating(true);
    setEditDialogOpen(false);

    try {
        // Optimistically update the UI with text changes
        const optimisticallyUpdatedUser = { ...userData, ...updatedData };
        setUserData(optimisticallyUpdatedUser);
        
        // Update text-based fields in the backend
        await updateUserProfile(user.uid, updatedData);
        
        // Handle file upload in the background
        if (avatarFile) {
            const avatarUrl = await uploadProfilePhoto(user.uid, avatarFile);
            // Once uploaded, save the new URL and update the UI again
            await updateUserProfile(user.uid, { avatarUrl });
            // This final fetch ensures we have the definitive state
            await fetchUserData();
        }
        
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });

    } catch (error) {
         toast({
            title: "Update Failed",
            description: "There was an error updating your profile.",
            variant: "destructive",
        });
        // On error, refetch to revert to the source of truth
        await fetchUserData();
    } finally {
        setIsUpdating(false);
    }
  }


  if (loading) {
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
             {isUpdating && <div className="absolute top-4 right-28 text-sm text-muted-foreground">Saving...</div>}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="absolute top-4 right-4" variant="outline">Edit Profile</Button>
                </DialogTrigger>
                {/* We pass the userData from context to the dialog */}
                <EditProfileDialog 
                    user={userData} 
                    onProfileUpdate={handleProfileUpdate} 
                    closeDialog={() => setEditDialogOpen(false)}
                />
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
