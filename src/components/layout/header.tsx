import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { studentProfile } from "@/lib/data";

export function Header() {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.briefcase className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">SkillBridge</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/profile">
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={studentProfile.avatarUrl} alt={studentProfile.name} data-ai-hint="student portrait" />
                  <AvatarFallback>{getInitials(studentProfile.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
