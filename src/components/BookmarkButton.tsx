import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";

interface BookmarkButtonProps {
  chapterNumber: number;
  title: string;
}

export const BookmarkButton = ({ chapterNumber, title }: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const bookmarked = isBookmarked(chapterNumber);

  const handleToggle = () => {
    toggleBookmark(chapterNumber, title);
    toast({
      title: bookmarked ? "Bookmark removed" : "Bookmark added",
      description: bookmarked
        ? "Chapter removed from your bookmarks"
        : "Chapter saved to your bookmarks",
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="gap-2"
    >
      <Bookmark
        className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`}
      />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};
