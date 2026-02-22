import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ResponsibilityScoreQuiz } from "@/components/ResponsibilityScoreQuiz";

const ResponsibilityQuiz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ResponsibilityScoreQuiz />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResponsibilityQuiz;
