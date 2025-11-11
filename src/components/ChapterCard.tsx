import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";

interface ChapterCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  topics: string[];
}

export const ChapterCard = ({ number, title, description, icon: Icon, topics }: ChapterCardProps) => {
  return (
    <Link to={`/chapter/${number}`}>
      <Card className="group p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-border bg-gradient-to-br from-card to-accent/20 animate-fade-in cursor-pointer hover:scale-[1.02]">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-medium text-primary mb-1">
            Chapter {number}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border"
          >
            {topic}
          </span>
        ))}
      </div>
    </Card>
    </Link>
  );
};
