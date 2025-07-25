import { StudentProfileCard } from "@/components/student-profile-card";
import { studentProfile } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StudentProfileCard student={studentProfile} />
    </div>
  );
}
