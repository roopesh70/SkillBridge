export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  description: string;
  rating: number;
  reviewCount: number;
};

export type Student = {
  name: string;
  major: string;
  university: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    verified: boolean;
  }[];
};

export const studentProfile: Student = {
  name: "Alex Doe",
  major: "Computer Science",
  university: "State University",
  bio: "A passionate computer science student with a knack for full-stack development and a strong interest in AI-driven solutions. Eager to apply my skills in a dynamic and challenging environment.",
  avatarUrl: "https://placehold.co/100x100",
  skills: ["React", "Node.js", "Python", "TypeScript", "Next.js", "Data Analysis", "Machine Learning"],
  experience: [
    {
      title: "Software Engineer Intern",
      company: "Innovatech Solutions",
      duration: "Summer 2023",
      description: "Developed and maintained features for a large-scale web application using React and Node.js. Collaborated with a team of engineers to deliver high-quality code in an agile environment."
    },
    {
      title: "Freelance Web Developer",
      company: "Self-Employed",
      duration: "2022 - Present",
      description: "Created custom websites for small businesses, focusing on responsive design and user experience. Managed projects from conception to deployment."
    }
  ],
  certifications: [
    {
      name: "Certified Full-Stack Developer",
      issuer: "CodeAcademy",
      verified: true,
    },
    {
      name: "Machine Learning Specialist",
      issuer: "Coursera",
      verified: true,
    },
    {
      name: "Agile Foundations",
      issuer: "LinkedIn Learning",
      verified: false,
    }
  ]
};

export const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechForward Inc.",
    location: "San Francisco, CA",
    type: "Part-Time",
    skills: ["React", "TypeScript", "CSS"],
    description: "Join our dynamic team to build beautiful and responsive user interfaces for our flagship product. You will work closely with designers and backend engineers.",
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    company: "DataWise Analytics",
    location: "New York, NY",
    type: "Flexible",
    skills: ["Python", "SQL", "Tableau"],
    description: "Help us make sense of large datasets to drive business decisions. This role involves data cleaning, analysis, and visualization. A great opportunity to learn from seasoned data scientists.",
    rating: 4.5,
    reviewCount: 15,
  },
  {
    id: 3,
    title: "UX/UI Design Intern",
    company: "Creative Minds Studio",
    location: "Austin, TX (Remote)",
    type: "Freelance",
    skills: ["Figma", "Sketch", "User Research"],
    description: "We are looking for a creative UX/UI intern to help design the next generation of our mobile app. You will be involved in the entire design process, from user research to final mockups.",
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 4,
    title: "Social Media Marketing Intern",
    company: "Connect Social",
    location: "Los Angeles, CA",
    type: "Part-Time",
    skills: ["Content Creation", "SEO", "Analytics"],
    description: "Manage our social media channels, create engaging content, and analyze campaign performance. If you are passionate about digital marketing, this is the role for you.",
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 5,
    title: "Backend Developer Intern",
    company: "ServerStrong",
    location: "Boston, MA",
    type: "Full-Time",
    skills: ["Node.js", "Express", "MongoDB"],
    description: "Work on the core infrastructure of our platform. You will be responsible for designing and implementing RESTful APIs, managing databases, and ensuring scalability.",
    rating: 4.7,
    reviewCount: 25,
  },
  {
    id: 6,
    title: "Junior Project Manager",
    company: "BuildIt Right",
    location: "Chicago, IL",
    type: "Flexible",
    skills: ["Agile", "Scrum", "Communication"],
    description: "Assist our project managers in planning and executing projects. This is a great entry-level role for someone organized and with strong communication skills.",
    rating: 4.4,
    reviewCount: 12,
  }
];
