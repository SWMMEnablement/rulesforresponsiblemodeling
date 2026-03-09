import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CrossReferenceMatrix } from "@/components/CrossReferenceMatrix";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid3X3 } from "lucide-react";

const CrossReference = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-to-br from-primary via-primary-light to-secondary py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Grid3X3 className="w-10 h-10 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Chapter Cross-Reference Matrix
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              See which chapters apply to each phase of the modeling workflow. Click any activity to filter, or click a row to see details.
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <CrossReferenceMatrix />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CrossReference;
