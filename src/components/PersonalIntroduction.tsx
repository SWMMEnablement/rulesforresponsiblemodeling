import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Award, BookOpen, Users, Quote, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            Bringing William James's Wisdom to Life
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transforming a 303-page PDF into an interactive learning experience for the next generation of water modelers
          </p>
        </div>

        <Card className="p-8 md:p-10 bg-card border-l-4 border-l-primary mb-8">
          <div className="flex items-start gap-3 mb-6">
            <Quote className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-lg md:text-xl text-foreground leading-relaxed italic mb-6">
                "I first met Dr. William James in 1978 when he visited us at the University of Florida. 
                His insights on responsible modeling practices shaped my entire career. When he published 
                'Rules for Responsible Modeling' in 2005, it distilled decades of wisdom that every 
                serious hydrological modeler should read. The problem? It's a dense PDF—hard to search, 
                easy to forget. So I built this app to change that."
              </p>
              <p className="text-right text-muted-foreground font-medium">
                — Robert Dickinson
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Why This Book Matters Now More Than Ever</h3>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div className="space-y-4">
                <p>
                  James's core message is more relevant than ever: <strong className="text-foreground">Models 
                  are decision-support tools, not crystal balls.</strong>
                </p>
                <p>
                  In an era where we can generate sophisticated SWMM and ICM models faster than ever, 
                  his warnings about responsible practice become critical:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>"Garbage in, garbage out" <em>oversimplifies</em> the real challenge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Optimal complexity is <em>not</em> maximum complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Uncertainty must be communicated honestly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span>Calibration without validation is self-deception</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <p>
                  I've spent <strong className="text-foreground">50+ years in water modeling</strong>—from the 
                  early SWMM3 days through InfoSWMM, XPSWMM, and now ICM InfoWorks. I've seen modelers 
                  make every mistake James warns about. His rules aren't academic abstractions; they're 
                  hard-won lessons I've watched play out on real projects.
                </p>
                <p>
                  Building this app is part of my effort to document what matters before it's lost. 
                  The <strong className="text-foreground">"Dickinson Canon"</strong> at SWMM5.org captures 
                  my technical knowledge. This app captures the <em>philosophy</em> that should guide 
                  how we use that knowledge.
                </p>
                <a 
                  href="https://swmm5.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="mt-2 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit SWMM5.org
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline Card */}
        <Card className="p-6 bg-muted/30 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">A Legacy in Water Modeling</h4>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">1937</span>
              <span className="text-muted-foreground">William James born</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">1978</span>
              <span className="text-muted-foreground">James visits UF; our paths cross</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">2005</span>
              <span className="text-muted-foreground">"Rules for Responsible Modeling" published</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">2024</span>
              <span className="text-muted-foreground">This interactive edition</span>
            </div>
          </div>
        </Card>

        {/* Experience Highlights */}
        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Years in Water Modeling</div>
            <div className="text-xs text-muted-foreground mt-1">SWMM3 → ICM InfoWorks</div>
          </Card>
          
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">17</div>
            <div className="text-sm text-muted-foreground">Interactive Chapters</div>
            <div className="text-xs text-muted-foreground mt-1">From 303-page PDF</div>
          </Card>
          
          <Card className="p-6 text-center bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">∞</div>
            <div className="text-sm text-muted-foreground">Future Modelers to Inspire</div>
            <div className="text-xs text-muted-foreground mt-1">Preserving wisdom</div>
          </Card>
        </div>
      </div>
    </section>
  );
};
