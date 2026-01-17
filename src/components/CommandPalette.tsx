import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Book, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Home, 
  Info, 
  Library, 
  MessageSquareQuote,
  Search,
  StickyNote
} from "lucide-react";
import { glossaryTerms } from "@/data/glossaryData";
import { keyQuotesFlashcardData } from "@/data/keyQuotesFlashcardData";

const chapters = [
  { number: 1, title: "Introduction to Modeling" },
  { number: 2, title: "Understanding Uncertainty" },
  { number: 3, title: "Data Quality and Sources" },
  { number: 4, title: "Model Complexity" },
  { number: 5, title: "Continuous Simulation" },
  { number: 6, title: "Rainfall Analysis" },
  { number: 7, title: "Storm Spatial Structure" },
  { number: 8, title: "Decision Support Systems" },
  { number: 9, title: "Objective Functions" },
  { number: 10, title: "Uncertainty Analysis" },
  { number: 11, title: "Sensitivity Analysis" },
  { number: 12, title: "State Variable Representation" },
  { number: 13, title: "Performance Metrics" },
  { number: 14, title: "Optimization Techniques" },
  { number: 15, title: "Fuzzy Logic Applications" },
  { number: 16, title: "Model Error Analysis" },
  { number: 17, title: "Rules for Responsible Modeling" },
];

const pages = [
  { path: "/", label: "Home", icon: Home },
  { path: "/glossary", label: "Glossary", icon: Library },
  { path: "/study-guide", label: "Study Guide", icon: GraduationCap },
  { path: "/key-quotes", label: "Key Quotes", icon: MessageSquareQuote },
  { path: "/resources", label: "Resources", icon: FileText },
  { path: "/about-author", label: "About Author", icon: Info },
  { path: "/notes", label: "My Notes", icon: StickyNote },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search chapters, glossary terms, quotes..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={`page ${page.label}`}
              onSelect={() => handleSelect(page.path)}
            >
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Chapters">
          {chapters.map((chapter) => (
            <CommandItem
              key={chapter.number}
              value={`chapter ${chapter.number} ${chapter.title}`}
              onSelect={() => handleSelect(`/chapter/${chapter.number}`)}
            >
              <Book className="mr-2 h-4 w-4" />
              <span>Chapter {chapter.number}: {chapter.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Key Quotes">
          {keyQuotesFlashcardData.map((quote) => (
            <CommandItem
              key={quote.id}
              value={`quote ${quote.term} ${quote.definition.substring(0, 50)}`}
              onSelect={() => handleSelect(`/chapter/${quote.chapter}`)}
            >
              <MessageSquareQuote className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{quote.term}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {quote.definition.substring(0, 60)}...
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Glossary Terms">
          {glossaryTerms.slice(0, 20).map((term) => (
            <CommandItem
              key={term.term}
              value={`glossary ${term.term} ${term.definition.substring(0, 30)}`}
              onSelect={() => handleSelect("/glossary")}
            >
              <BookOpen className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{term.term}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {term.definition.substring(0, 50)}...
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      
      <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-3 w-3" />
          <span>Type to search</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
          <span>to toggle</span>
        </div>
      </div>
    </CommandDialog>
  );
};
