import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Code, 
  Download, 
  Copy, 
  Check, 
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Terminal
} from "lucide-react";
import { Link } from "react-router-dom";
import { RubySyntaxHighlighter } from "@/components/RubySyntaxHighlighter";
import { chapterAnnotations } from "@/components/ModernAnnotation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Extract CodeSnippet interface
interface CodeSnippet {
  language: "ruby" | "python";
  platform: "SWMM5" | "ICM InfoWorks" | "ICM SWMM" | "pyswmm";
  title: string;
  code: string;
  description?: string;
}

interface ExtractedSnippet extends CodeSnippet {
  chapter: number;
  annotationConcept: string;
}

// Python syntax highlighter
const PythonHighlighter = ({ code }: { code: string }) => {
  const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'return', 'with', 'try', 'except', 'finally', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'lambda', 'yield', 'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'del'];
  const builtins = ['print', 'len', 'range', 'open', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'isinstance', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round', 'sorted', 'reversed', 'any', 'all'];
  
  const lines = code.split('\n');
  
  const highlightLine = (line: string) => {
    const parts: JSX.Element[] = [];
    let remaining = line;
    let key = 0;
    
    while (remaining.length > 0) {
      if (remaining.startsWith('#')) {
        parts.push(<span key={key++} className="text-slate-500 italic">{remaining}</span>);
        break;
      }
      
      const stringMatch = remaining.match(/^(["']{3}[\s\S]*?["']{3}|["'][^"']*["'])/);
      if (stringMatch) {
        parts.push(<span key={key++} className="text-amber-400">{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }
      
      const numMatch = remaining.match(/^\d+\.?\d*/);
      if (numMatch) {
        parts.push(<span key={key++} className="text-purple-400">{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      
      const wordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (keywords.includes(word)) {
          parts.push(<span key={key++} className="text-red-400 font-semibold">{word}</span>);
        } else if (builtins.includes(word)) {
          parts.push(<span key={key++} className="text-blue-400">{word}</span>);
        } else if (word[0] === word[0].toUpperCase()) {
          parts.push(<span key={key++} className="text-yellow-300">{word}</span>);
        } else {
          parts.push(<span key={key++} className="text-slate-200">{word}</span>);
        }
        remaining = remaining.slice(word.length);
        continue;
      }
      
      parts.push(<span key={key++} className="text-slate-300">{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
    
    return parts;
  };
  
  return (
    <div className="text-xs font-mono leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="hover:bg-slate-800/50 px-2">
          {line ? highlightLine(line) : <span>&nbsp;</span>}
        </div>
      ))}
    </div>
  );
};

// Chapter titles
const chapterTitles: Record<number, string> = {
  1: "Introduction",
  2: "Deterministic Modeling",
  3: "Reliability of Input",
  4: "Optimal Complexity",
  5: "Continuous Simulation",
  6: "Rainfall Analysis",
  7: "Storm Kinematics",
  8: "Decision Support",
  9: "Objective Functions",
  10: "Uncertainty Analysis",
  11: "Calibration",
  12: "State Variables",
  13: "Performance Metrics",
  14: "Optimization",
  15: "Fuzzy Logic",
  16: "Real-Time Forecasting",
  17: "Conclusions"
};

const CodeLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "ruby" | "python">("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [expandedSnippets, setExpandedSnippets] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all code snippets from chapterAnnotations
  const allSnippets = useMemo((): ExtractedSnippet[] => {
    const snippets: ExtractedSnippet[] = [];
    
    Object.entries(chapterAnnotations).forEach(([chapterNum, annotations]) => {
      annotations.forEach(annotation => {
        if (annotation.codeSnippets) {
          annotation.codeSnippets.forEach(snippet => {
            snippets.push({
              ...snippet,
              chapter: parseInt(chapterNum),
              annotationConcept: annotation.originalConcept
            });
          });
        }
      });
    });
    
    return snippets.sort((a, b) => a.chapter - b.chapter);
  }, []);

  // Get unique platforms
  const platforms = useMemo(() => {
    const platformSet = new Set(allSnippets.map(s => s.platform));
    return Array.from(platformSet).sort();
  }, [allSnippets]);

  // Filter snippets
  const filteredSnippets = useMemo(() => {
    return allSnippets.filter(snippet => {
      // Language filter
      if (selectedLanguage !== "all" && snippet.language !== selectedLanguage) {
        return false;
      }
      
      // Platform filter
      if (selectedPlatform !== "all" && snippet.platform !== selectedPlatform) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          snippet.title.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query) ||
          (snippet.description?.toLowerCase().includes(query)) ||
          snippet.annotationConcept.toLowerCase().includes(query) ||
          chapterTitles[snippet.chapter]?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [allSnippets, selectedLanguage, selectedPlatform, searchQuery]);

  // Group by chapter
  const groupedSnippets = useMemo(() => {
    const groups: Record<number, ExtractedSnippet[]> = {};
    filteredSnippets.forEach(snippet => {
      if (!groups[snippet.chapter]) {
        groups[snippet.chapter] = [];
      }
      groups[snippet.chapter].push(snippet);
    });
    return groups;
  }, [filteredSnippets]);

  const toggleSnippet = (id: string) => {
    setExpandedSnippets(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (snippet: ExtractedSnippet) => {
    const ext = snippet.language === 'ruby' ? 'rb' : 'py';
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ch${snippet.chapter}_${snippet.title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const platformColors: Record<string, string> = {
    "SWMM5": "bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400",
    "ICM InfoWorks": "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400",
    "ICM SWMM": "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
    "pyswmm": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
  };

  const languageStats = useMemo(() => {
    const ruby = allSnippets.filter(s => s.language === 'ruby').length;
    const python = allSnippets.filter(s => s.language === 'python').length;
    return { ruby, python, total: allSnippets.length };
  }, [allSnippets]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">Automation Library</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Code Snippets Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            A searchable collection of {languageStats.total} automation examples from the 2025 Practitioner's Notes. 
            Ready-to-use Ruby and Python scripts for SWMM5, ICM InfoWorks, and ICM SWMM.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Code className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{languageStats.ruby} Ruby Scripts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{languageStats.python} Python Scripts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">17 Chapters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 px-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by keyword, concept, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Language Filter */}
            <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Languages</TabsTrigger>
                <TabsTrigger value="ruby" className="gap-1">
                  <span className="hidden sm:inline">Ruby</span>
                  <Badge variant="secondary" className="text-xs">{languageStats.ruby}</Badge>
                </TabsTrigger>
                <TabsTrigger value="python" className="gap-1">
                  <span className="hidden sm:inline">Python</span>
                  <Badge variant="secondary" className="text-xs">{languageStats.python}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Platform Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredSnippets.length} of {allSnippets.length} snippets
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </div>
        </div>
      </section>

      {/* Snippets List */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {Object.keys(groupedSnippets).length === 0 ? (
            <Card className="p-12 text-center">
              <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No snippets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </Card>
          ) : (
            Object.entries(groupedSnippets).map(([chapter, snippets]) => (
              <div key={chapter}>
                <div className="flex items-center gap-3 mb-4">
                  <Link to={`/chapter/${chapter}`} className="hover:underline">
                    <h2 className="text-xl font-bold text-foreground">
                      Chapter {chapter}: {chapterTitles[parseInt(chapter)]}
                    </h2>
                  </Link>
                  <Badge variant="secondary">{snippets.length} snippet{snippets.length !== 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="space-y-4">
                  {snippets.map((snippet, idx) => {
                    const snippetId = `${chapter}-${idx}`;
                    const isExpanded = expandedSnippets.has(snippetId);
                    
                    return (
                      <Card key={snippetId} className="overflow-hidden">
                        <Collapsible open={isExpanded} onOpenChange={() => toggleSnippet(snippetId)}>
                          <CollapsibleTrigger className="w-full">
                            <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3 text-left">
                                <Code className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                  <h3 className="font-medium text-foreground">{snippet.title}</h3>
                                  <p className="text-xs text-muted-foreground">{snippet.annotationConcept}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={platformColors[snippet.platform] || ''}>
                                  {snippet.platform}
                                </Badge>
                                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-xs">
                                  {snippet.language === 'ruby' ? 'Ruby' : 'Python'}
                                </Badge>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="border-t border-border">
                              {/* Description */}
                              {snippet.description && (
                                <div className="px-4 py-3 bg-muted/30 border-b border-border">
                                  <p className="text-sm text-muted-foreground">{snippet.description}</p>
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="px-4 py-2 bg-slate-900 flex items-center justify-end gap-2 border-b border-slate-700">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(snippet.code, snippetId);
                                  }}
                                  className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                  {copiedId === snippetId ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 mr-1 text-green-400" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 mr-1" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(snippet);
                                  }}
                                  className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                  <Download className="w-3.5 h-3.5 mr-1" />
                                  Download
                                </Button>
                              </div>
                              
                              {/* Code */}
                              <div className="p-4 bg-slate-900 overflow-x-auto max-h-96 overflow-y-auto">
                                {snippet.language === 'ruby' ? (
                                  <RubySyntaxHighlighter code={snippet.code} defaultShowLineNumbers={true} />
                                ) : (
                                  <PythonHighlighter code={snippet.code} />
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Explore More</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/resources">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Resources & Documentation
              </Button>
            </Link>
            <Link to="/study-guide">
              <Button variant="outline">
                <Terminal className="w-4 h-4 mr-2" />
                Study Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CodeLibrary;
