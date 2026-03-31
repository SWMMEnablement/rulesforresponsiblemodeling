import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  ChevronRight,
  Calendar,
  Lightbulb,
  Quote,
  Share2
} from "lucide-react";
import { toast } from "sonner";

interface WeeklyRule {
  ruleNumber: number;
  ruleTitle: string;
  vignette: {
    story: string;
    lesson: string;
    contributor?: string;
  };
  discussionPrompt: string;
  relatedChapters: number[];
  weekStartDate: string; // ISO date string for the Monday of the week
}

// Weekly rules that rotate - each entry represents a week's featured content
const weeklyRules: WeeklyRule[] = [
  {
    ruleNumber: 1,
    ruleTitle: "Be Clear About the Purpose",
    vignette: {
      story: "A consulting team spent three months building a detailed watershed model for a state agency. When delivered, the agency said: 'This is impressive, but we only needed a screening tool for permit reviews.' The mismatch between model complexity and actual need wasted 80% of the budget.",
      lesson: "Always document the specific decisions the model will inform before writing a single line of code.",
      contributor: "Anonymous State Regulator"
    },
    discussionPrompt: "How do you ensure alignment between model purpose and stakeholder expectations at the start of a project? What questions do you ask?",
    relatedChapters: [1, 2, 3],
    weekStartDate: "2025-01-20"
  },
  {
    ruleNumber: 3,
    ruleTitle: "Garbage In, Gospel Out",
    vignette: {
      story: "A flood model used 30-year-old topographic data because 'it was already digitized.' When the model dramatically under-predicted flooding in a new development area, investigation revealed the old maps showed farmland where a shopping center now sat.",
      lesson: "Data age and relevance must be explicitly evaluated against the model's decision timeframe.",
      contributor: "Municipal Engineer"
    },
    discussionPrompt: "What's your process for evaluating data quality and vintage? Do you have a 'data acceptance checklist' for your projects?",
    relatedChapters: [3, 4, 5],
    weekStartDate: "2025-01-27"
  },
  {
    ruleNumber: 5,
    ruleTitle: "Validate, Validate, Validate",
    vignette: {
      story: "A groundwater model was calibrated beautifully to historical heads. But when used to predict drawdown from a new pumping well, it failed spectacularly. The model had compensating errors: overestimated recharge balanced by overestimated discharge. It matched the past for wrong reasons.",
      lesson: "Calibration to historical data is necessary but not sufficient. Test predictions against independent data or scenarios.",
      contributor: "Hydrogeologist, Western US"
    },
    discussionPrompt: "Beyond split-sample testing, what creative validation approaches have you used to build confidence in model predictions?",
    relatedChapters: [5, 8, 9],
    weekStartDate: "2025-02-03"
  },
  {
    ruleNumber: 7,
    ruleTitle: "Quantify Uncertainty",
    vignette: {
      story: "A dam safety analysis presented a single 'failure probability' to regulators without uncertainty bounds. When challenged, the analyst admitted the number could vary by two orders of magnitude depending on assumptions. The credibility of the entire analysis collapsed.",
      lesson: "Single-point estimates without uncertainty communication are incomplete and potentially misleading.",
      contributor: "Dam Safety Engineer"
    },
    discussionPrompt: "How do you communicate uncertainty to non-technical stakeholders without overwhelming them? What visualizations work best?",
    relatedChapters: [7, 10, 11],
    weekStartDate: "2025-02-10"
  },
  {
    ruleNumber: 9,
    ruleTitle: "Document Everything",
    vignette: {
      story: "Five years after a major flood study, litigation required reproducing the original results. The modeler had retired, files were scattered across old hard drives, and key calibration decisions existed only in handwritten notes. Reconstruction took 6 months and $200,000.",
      lesson: "Documentation isn't overhead—it's insurance. Archive as if you'll need to defend the work in court in 10 years.",
      contributor: "Expert Witness"
    },
    discussionPrompt: "What documentation standards does your organization follow? How do you balance thoroughness with project budget constraints?",
    relatedChapters: [9, 12, 14],
    weekStartDate: "2025-02-17"
  },
  {
    ruleNumber: 2,
    ruleTitle: "Start Simple",
    vignette: {
      story: "A PhD student's first approach to a contamination problem was a 3D, multiphase, reactive transport model. After 18 months of debugging, their advisor asked: 'What does a simple mass balance tell us?' The answer—that contamination couldn't possibly reach the receptor—was available in an afternoon.",
      lesson: "Simple models often reveal whether complex modeling is even necessary.",
      contributor: "University Professor"
    },
    discussionPrompt: "How do you resist the temptation to over-engineer solutions? What signals tell you that simpler is sufficient?",
    relatedChapters: [2, 6, 7],
    weekStartDate: "2025-02-24"
  },
  {
    ruleNumber: 10,
    ruleTitle: "Iterate and Improve",
    vignette: {
      story: "A coastal erosion model built in 2010 was treated as 'finished' and used unchanged for 15 years. When storm patterns shifted due to climate change, predictions diverged dramatically from observations. No one had updated the underlying assumptions.",
      lesson: "Models are living documents. Schedule regular reviews against new data and changing conditions.",
      contributor: "Coastal Engineer"
    },
    discussionPrompt: "Do you have a formal process for model updates? How do you decide when an existing model needs revision vs. replacement?",
    relatedChapters: [10, 13, 15],
    weekStartDate: "2025-03-03"
  },
  {
    ruleNumber: 4,
    ruleTitle: "Know Your Audience",
    vignette: {
      story: "A brilliant technical presentation to a city council included 47 slides of sensitivity analyses. The council voted against the project—not because the modeling was wrong, but because they couldn't follow it. A competitor's simple 3-slide summary won the next bid.",
      lesson: "Technical rigor means nothing if stakeholders can't understand and trust the conclusions.",
      contributor: "Consulting Firm Principal"
    },
    discussionPrompt: "How do you tailor model communication to different audiences? What's your approach for elected officials vs. regulators vs. engineers?",
    relatedChapters: [4, 12, 16],
    weekStartDate: "2025-03-10"
  }
];

// Calculate which rule to show based on current date
const getCurrentWeekRule = (): WeeklyRule => {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Get Monday of current week
  currentWeekStart.setHours(0, 0, 0, 0);
  
  // Find the matching week or cycle through available rules
  const weekIndex = Math.floor(
    (currentWeekStart.getTime() - new Date("2025-01-20").getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  
  return weeklyRules[Math.abs(weekIndex) % weeklyRules.length];
};


export const RuleOfTheWeek = () => {
  const [currentRule, setCurrentRule] = useState<WeeklyRule>(getCurrentWeekRule());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setCurrentRule(getCurrentWeekRule());
  }, []);

  const handleShare = async () => {
    const shareText = `Rule of the Week: Rule ${currentRule.ruleNumber} - ${currentRule.ruleTitle}\n\n"${currentRule.vignette.story.slice(0, 100)}..."\n\nDiscuss: ${currentRule.discussionPrompt}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rule ${currentRule.ruleNumber}: ${currentRule.ruleTitle}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Rule of the Week</h2>
              <p className="text-sm text-muted-foreground">A new rule featured every week</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Card */}
        <Card className="p-0 overflow-hidden border-2 border-primary/20 shadow-xl">
          {/* Rule Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-0">
                  Rule {currentRule.ruleNumber}
                </Badge>
                <h3 className="text-2xl font-bold">{currentRule.ruleTitle}</h3>
              </div>
              <Lightbulb className="w-10 h-10 opacity-50" />
            </div>
          </div>

          {/* Vignette Section */}
          <div className="p-6 space-y-6">
            {/* Story */}
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
              <div className="pl-6">
                <p className="text-foreground leading-relaxed italic">
                  "{isExpanded ? currentRule.vignette.story : currentRule.vignette.story.slice(0, 200)}
                  {!isExpanded && currentRule.vignette.story.length > 200 && "..."}
                  {currentRule.vignette.story.length > 200 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-primary hover:underline ml-1 font-medium not-italic"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}"
                </p>
                {currentRule.vignette.contributor && (
                  <p className="text-sm text-muted-foreground mt-2">
                    — {currentRule.vignette.contributor}
                  </p>
                )}
              </div>
            </div>

            {/* Lesson */}
            <div className="bg-accent/30 rounded-lg p-4 border-l-4 border-primary">
              <p className="font-medium text-foreground flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span><strong>Lesson:</strong> {currentRule.vignette.lesson}</span>
              </p>
            </div>

            <Separator />

            {/* Discussion Prompt */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <MessageCircle className="w-5 h-5" />
                <h4 className="font-semibold">Discussion Prompt</h4>
              </div>
              <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg border border-border/50">
                {currentRule.discussionPrompt}
              </p>
            </div>

            <Separator />

            {/* Related Chapters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Related Chapters:</span>
                <div className="flex gap-2">
                  {currentRule.relatedChapters.map((chapter) => (
                    <Link key={chapter} to={`/chapter/${chapter}`}>
                      <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer transition-colors">
                        Ch. {chapter}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/case-vignettes">
                <Button variant="outline" size="sm" className="gap-2">
                  View All Stories
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Footer CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Have a story about this rule in action?
          </p>
          <Button variant="secondary" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Share Your Experience
          </Button>
        </div>
      </div>
    </section>
  );
};
