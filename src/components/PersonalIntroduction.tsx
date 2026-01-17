import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Award, BookOpen, Users, Quote } from "lucide-react";

export const PersonalIntroduction = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            From the Creator
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            50 Years of Water Modeling Wisdom
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A personal journey from early computational hydrology to creating this educational resource
          </p>
        </div>

        <Card className="p-8 md:p-10 bg-card border-l-4 border-l-primary">
          <div className="flex items-start gap-3 mb-6">
            <Quote className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-lg md:text-xl text-foreground leading-relaxed italic mb-6">
                "When I first encountered Dr. William James's 'Rules for Responsible Modeling' 
                decades ago, it fundamentally changed how I approached every project. His wisdom 
                deserved a modern, interactive format that could reach the next generation of 
                water resources professionals."
              </p>
              <p className="text-right text-muted-foreground font-medium">
                — Robert Dickinson
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Why I Created This Resource</h3>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div className="space-y-4">
                <p>
                  Over five decades in water resources engineering, I've witnessed the evolution 
                  from hand calculations to sophisticated computer models. Through it all, one 
                  truth remains constant: <strong className="text-foreground">a model is only 
                  as valuable as the judgment behind it</strong>.
                </p>
                <p>
                  Dr. James's principles guided countless projects—from urban stormwater 
                  management to watershed planning. His emphasis on uncertainty communication, 
                  optimal complexity, and ethical responsibility resonates more than ever in 
                  our data-rich era.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  This interactive edition transforms a dense technical text into an 
                  accessible learning experience. The calculators let you explore concepts 
                  hands-on. The flashcards use proven memory techniques. The quizzes reinforce 
                  understanding.
                </p>
                <p>
                  Whether you're a student encountering modeling for the first time or a 
                  seasoned practitioner seeking a refresher, I hope this resource honors 
                  Dr. James's legacy while making his insights actionable for modern practice.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Experience Highlights */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Years in Water Resources</div>
          </Card>
          
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">17</div>
            <div className="text-sm text-muted-foreground">Interactive Chapters</div>
          </Card>
          
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">∞</div>
            <div className="text-sm text-muted-foreground">Future Modelers to Inspire</div>
          </Card>
        </div>
      </div>
    </section>
  );
};
