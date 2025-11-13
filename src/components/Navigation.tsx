import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Library, GraduationCap } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Vibe APP</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/study-guide">
              <Button variant="ghost" size="sm" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Study Guide</span>
              </Button>
            </Link>
            <Link to="/glossary">
              <Button variant="ghost" size="sm" className="gap-2">
                <Library className="w-4 h-4" />
                <span className="hidden sm:inline">Glossary</span>
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="ghost" size="sm" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
