import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Library, GraduationCap, Menu, Moon, Sun, Keyboard, Quote } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export const Navigation = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useKeyboardShortcuts({
    onOpenHelp: () => setShortcutsOpen(true),
  });

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/study-guide", icon: GraduationCap, label: "Study Guide" },
    { to: "/key-quotes", icon: Quote, label: "Key Quotes" },
    { to: "/glossary", icon: Library, label: "Glossary" },
    { to: "/resources", icon: BookOpen, label: "Resources" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <ShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Rules for Responsible Modeling</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShortcutsOpen(true)}
              className="w-9 h-9 p-0"
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              aria-label="Toggle theme"
              title="Toggle theme (D)"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            {isMobile ? (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <link.icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};
