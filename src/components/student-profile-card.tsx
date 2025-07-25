import type { Student } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Icons } from "./icons";

interface StudentProfileCardProps {
  student: Student;
}

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-muted/30 p-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student portrait" />
            <AvatarFallback className="text-3xl">{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold">{student.name}</CardTitle>
            <CardDescription className="text-lg mt-1">{student.major} at {student.university}</CardDescription>
            <p className="text-muted-foreground mt-4">{student.bio}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {student.skills.map(skill => (
              <Badge key={skill} variant="default" className="text-sm bg-primary/80 hover:bg-primary">{skill}</Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
          <div className="space-y-6">
            {student.experience.map((exp, index) => (
              <div key={index}>
                <h4 className="font-semibold">{exp.title}</h4>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                <p className="mt-2 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          <h3 className="text-xl font-semibold mb-4">Certifications</h3>
          <ul className="space-y-3">
            {student.certifications.map((cert, index) => (
              <li key={index} className="flex items-center">
                <Icons.award className="h-5 w-5 mr-3 text-primary"/>
                <span className="font-medium">{cert.name}</span>
                <span className="text-muted-foreground mx-2">-</span>
                <span className="text-muted-foreground">{cert.issuer}</span>
                {cert.verified && <Icons.shieldCheck className="h-5 w-5 ml-2 text-green-500" />}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
