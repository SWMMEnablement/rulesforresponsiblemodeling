import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";

interface ShareRuleProps {
  ruleNumber: number;
  ruleText: string;
  chapterNumber: number;
}

export const ShareRule = ({ ruleNumber, ruleText, chapterNumber }: ShareRuleProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/chapter/${chapterNumber}#rule-${ruleNumber}`;
  const shareText = `"Rule ${ruleNumber}: ${ruleText}" — William James, Rules for Responsible Modeling\n\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Rule copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const text = `"Rule ${ruleNumber}: ${ruleText}" — William James, Rules for Responsible Modeling`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareEmail = () => {
    const subject = `Rule ${ruleNumber} — Rules for Responsible Modeling`;
    const body = shareText;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary">
          <Share2 className="w-3.5 h-3.5" />
          <span className="text-xs">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleShareLinkedIn}>
            📎 Share on LinkedIn
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleShareTwitter}>
            🐦 Share on Twitter
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" onClick={handleShareEmail}>
            ✉️ Share via Email
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
