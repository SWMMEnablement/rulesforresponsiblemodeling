import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, BookOpen, Award, GraduationCap } from "lucide-react";

const AboutAuthor = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About the Author
          </h1>
          <p className="text-xl text-muted-foreground">
            William James
          </p>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Biography
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                William James is a renowned expert in computational hydraulics and environmental modeling 
                with over three decades of experience in the field. He has dedicated his career to 
                advancing the science and practice of responsible modeling in water resources engineering.
              </p>
              <p>
                As a principal consultant and researcher, Dr. James has contributed significantly to 
                the development of best practices in hydraulic and hydrologic modeling. His work has 
                influenced thousands of engineers and scientists worldwide, helping them understand 
                the importance of ethical and scientifically sound modeling practices.
              </p>
              <p>
                Through his affiliation with CHI (Computational Hydraulics International), Dr. James 
                has been at the forefront of developing tools and methodologies that balance technical 
                sophistication with practical applicability. His approach emphasizes understanding 
                model limitations, validating results, and communicating findings responsibly.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Expertise & Credentials
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Expert in computational hydraulics and hydrologic modeling</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Principal consultant at Computational Hydraulics International (CHI)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Developer of modeling best practices and quality assurance protocols</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Educator and trainer for engineering professionals worldwide</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p>Advocate for responsible and ethical modeling practices</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              About This Book
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">Rules for Responsible Modeling</span> represents 
                the culmination of Dr. James's extensive experience in the field. Now in its 4th edition, 
                this comprehensive guide has become an essential resource for anyone involved in environmental 
                and hydraulic modeling.
              </p>
              <p>
                The book addresses the critical gap between modeling theory and practice, providing 
                actionable guidelines that help practitioners avoid common pitfalls and maintain 
                scientific integrity throughout the modeling process.
              </p>
              <div className="pt-4 border-t border-border mt-6">
                <p className="text-sm">
                  <span className="font-semibold text-foreground">Published by:</span> CHI (Computational Hydraulics International)
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold text-foreground">ISBN:</span> 0-9683681-5-8
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold text-foreground">Edition:</span> 4th Edition (2005)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/30 border-t border-border mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Book Content
            </Button>
          </Link>
        </div>
      </footer>
      </div>
    </>
  );
};

export default AboutAuthor;
