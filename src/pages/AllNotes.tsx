import { useState, useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllNotes() {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "chapter">("recent");

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "recent":
        return filtered.sort((a, b) => b.lastModified - a.lastModified);
      case "oldest":
        return filtered.sort((a, b) => a.lastModified - b.lastModified);
      case "chapter":
        return filtered.sort((a, b) => a.chapterNumber - b.chapterNumber);
      default:
        return filtered;
    }
  }, [notes, searchQuery, sortBy]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <StickyNote className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">All Notes</h1>
          </div>
          <p className="text-muted-foreground">
            View and search all your chapter notes in one place
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="chapter">By Chapter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredAndSortedNotes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {notes.length === 0 ? "No notes yet" : "No notes found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {notes.length === 0
                ? "Start taking notes on chapters to see them here"
                : "Try adjusting your search query"}
            </p>
            {notes.length === 0 && (
              <Link to="/">
                <Button>Browse Chapters</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedNotes.length} of {notes.length} note
              {notes.length !== 1 ? "s" : ""}
            </p>
            {filteredAndSortedNotes.map((note) => (
              <Card
                key={note.chapterNumber}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Chapter {note.chapterNumber}
                    </Badge>
                    <Link
                      to={`/chapter/${note.chapterNumber}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Chapter →
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.lastModified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
