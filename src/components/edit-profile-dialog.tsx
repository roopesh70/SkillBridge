"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile, uploadProfilePhoto, type UserData } from "@/lib/user-service";
import { useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Icons } from "./icons";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  major: z.string().min(2, "Major must be at least 2 characters."),
  university: z.string().min(2, "University must be at least 2 characters."),
  bio: z.string().max(300, "Bio cannot exceed 300 characters.").optional(),
  avatarUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })).optional(),
  certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      verified: z.boolean(),
  })).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  user: UserData;
  onProfileUpdate: () => void;
  closeDialog: () => void;
}

export function EditProfileDialog({ user, onProfileUpdate, closeDialog }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      major: user.major,
      university: user.university,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      skills: user.skills,
      experience: user.experience,
      certifications: user.certifications,
    },
  });

  const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray({
      control: form.control,
      name: "skills",
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      let avatarUrl = user.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadProfilePhoto(user.uid, avatarFile);
      }
      
      const updatedData = { ...data, avatarUrl };

      await updateUserProfile(user.uid, updatedData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      onProfileUpdate();
      closeDialog();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6 p-1">
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || ''} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <Button type="button" onClick={() => fileInputRef.current?.click()}>
                    Change Photo
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="major"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Major</FormLabel>
                            <FormControl>
                            <Input placeholder="Your major" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>University</FormLabel>
                        <FormControl>
                        <Input placeholder="Your university" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Tell us about yourself" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Separator />
                
                <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    {skillsFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 mb-2">
                            <FormField
                                control={form.control}
                                name={`skills.${index}`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. React" />
                                    </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => removeSkill(index)}>
                                <Icons.trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => appendSkill("")}>Add Skill</Button>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-2">Work Experience</h4>
                    {expFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md mb-4 space-y-2 relative">
                            <FormField control={form.control} name={`experience.${index}.title`} render={({field}) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`experience.${index}.company`} render={({field}) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`experience.${index}.duration`} render={({field}) => (<FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`experience.${index}.description`} render={({field}) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExp(index)}>
                                <Icons.trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => appendExp({title: "", company: "", duration: "", description: ""})}>Add Experience</Button>
                </div>
                
                <Separator />

                <div>
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    {certFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md mb-4 space-y-2 relative">
                             <FormField control={form.control} name={`certifications.${index}.name`} render={({field}) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name={`certifications.${index}.issuer`} render={({field}) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCert(index)}>
                                <Icons.trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                     <Button type="button" size="sm" variant="outline" onClick={() => appendCert({name: "", issuer: "", verified: false})}>Add Certification</Button>
                </div>


            </div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
