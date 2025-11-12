import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save, Trash2 } from "lucide-react";
import { z } from "zod";

interface ChapterNotesProps {
  chapterNumber: number;
}

const noteSchema = z.object({
  content: z
    .string()
    .trim()
    .max(5000, { message: "Note must be less than 5000 characters" }),
});

export const ChapterNotes = ({ chapterNumber }: ChapterNotesProps) => {
  const { getNote, saveNote, deleteNote } = useNotes();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const existingNote = getNote(chapterNumber);
    if (existingNote) {
      setContent(existingNote.content);
    }
  }, [chapterNumber, getNote]);

  const handleSave = () => {
    try {
      // Validate input
      const validated = noteSchema.parse({ content });
      
      if (validated.content.length === 0) {
        setError("Note cannot be empty");
        return;
      }

      saveNote(chapterNumber, validated.content);
      setError(null);
      setIsEditing(false);
      
      toast({
        title: "Note saved",
        description: "Your notes have been saved successfully",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Failed to save note");
      }
    }
  };

  const handleDelete = () => {
    deleteNote(chapterNumber);
    setContent("");
    setIsEditing(false);
    
    toast({
      title: "Note deleted",
      description: "Your notes have been removed",
    });
  };

  const existingNote = getNote(chapterNumber);
  const characterCount = content.length;
  const maxCharacters = 5000;

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Personal Notes</h3>
          </div>
          {existingNote && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {!existingNote && !isEditing ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No notes yet. Add your thoughts and insights about this chapter.
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        ) : (
          <>
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setError(null);
                  }}
                  placeholder="Write your notes here... You can include key insights, questions, or personal reflections about this chapter."
                  className="min-h-[200px] resize-y"
                  maxLength={maxCharacters}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {characterCount} / {maxCharacters} characters
                  </span>
                  {error && (
                    <span className="text-sm text-red-500">{error}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </Button>
                  {existingNote && (
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setContent(existingNote?.content || "");
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">
                    {content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Last modified:{" "}
                    {existingNote &&
                      new Date(existingNote.lastModified).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
