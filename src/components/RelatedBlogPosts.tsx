import { ExternalLink, BookOpen, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface BlogPost {
  title: string;
  url: string;
  description: string;
  tags?: string[];
}

// Mapping of chapter numbers to related SWMM5.org blog posts
// Only verified article destinations belong here. The former generated slugs
// were not source-backed, so no related articles are displayed until reviewed.
const chapterBlogPostsMap: Record<number, BlogPost[]> = {};

interface RelatedBlogPostsProps {
  chapterNumber: number;
}

export const RelatedBlogPosts = ({ chapterNumber }: RelatedBlogPostsProps) => {
  const posts = chapterBlogPostsMap[chapterNumber] || [];

  if (posts.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-secondary/5 border-accent/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="w-5 h-5 text-accent" />
          Related SWMM5.org Posts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore these blog posts for deeper insights related to this chapter's topics.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="p-4 rounded-lg border border-border bg-background/60 hover:bg-background hover:border-accent/40 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs py-0 px-2"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};
