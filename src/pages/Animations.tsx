import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { UncertaintyFunnel } from "@/components/UncertaintyFunnel";
import { CalibrationVsValidation } from "@/components/CalibrationVsValidation";
import { DataDecayTimeline } from "@/components/DataDecayTimeline";
import { GarbageInGospelOut } from "@/components/GarbageInGospelOut";
import { PrecisionIllusion } from "@/components/PrecisionIllusion";
import { SensitivitySpider } from "@/components/SensitivitySpider";
import { ConfidenceZones } from "@/components/ConfidenceZones";
import { ComplexitySimulator } from "@/components/ComplexitySimulator";
import { EquifinalityProblem } from "@/components/EquifinalityProblem";
import { CalibrationDance } from "@/components/CalibrationDance";
import { StakeholderTranslation } from "@/components/StakeholderTranslation";
import { ReportCard } from "@/components/ReportCard";
import { RainGaugeDensity } from "@/components/RainGaugeDensity";
import { PhilosophyEvolution } from "@/components/PhilosophyEvolution";
import { SoftwareTranslationPanels } from "@/components/SoftwareTranslationPanels";
import { AnimationsToc } from "@/components/AnimationsToc";
import ScrollReveal from "@/components/ScrollReveal";
import { Sparkles } from "lucide-react";

const Animations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AnimationsToc />

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Conceptual Animations</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive visualizations that bring William James's modeling philosophy to life. Adjust parameters, watch concepts unfold, and build intuition for responsible modeling.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Concept Animations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-2">Core Concepts</h2>
            <p className="text-muted-foreground text-sm mb-8">The fundamental ideas that underpin responsible modeling practice.</p>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><div id="complexity-simulator" className="scroll-mt-20"><ComplexitySimulator /></div></ScrollReveal>
            <ScrollReveal><div id="uncertainty-funnel" className="scroll-mt-20"><UncertaintyFunnel /></div></ScrollReveal>
            <ScrollReveal><div id="calibration-validation" className="scroll-mt-20"><CalibrationVsValidation /></div></ScrollReveal>
            <ScrollReveal><div id="precision-illusion" className="scroll-mt-20"><PrecisionIllusion /></div></ScrollReveal>
            <ScrollReveal><div id="equifinality" className="scroll-mt-20"><EquifinalityProblem /></div></ScrollReveal>
          </div>
        </div>
      </section>

      {/* Data & Input Animations */}
      <section className="py-12 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-2">Data Quality & Inputs</h2>
            <p className="text-muted-foreground text-sm mb-8">Understanding how data quality drives model reliability.</p>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><div id="garbage-gospel" className="scroll-mt-20"><GarbageInGospelOut /></div></ScrollReveal>
            <ScrollReveal><div id="data-decay" className="scroll-mt-20"><DataDecayTimeline /></div></ScrollReveal>
            <ScrollReveal><div id="rain-gauge" className="scroll-mt-20"><RainGaugeDensity /></div></ScrollReveal>
          </div>
        </div>
      </section>

      {/* Analysis Animations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analysis & Interpretation</h2>
            <p className="text-muted-foreground text-sm mb-8">Tools for understanding sensitivity, confidence, and model limitations.</p>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><div id="sensitivity-spider" className="scroll-mt-20"><SensitivitySpider /></div></ScrollReveal>
            <ScrollReveal><div id="confidence-zones" className="scroll-mt-20"><ConfidenceZones /></div></ScrollReveal>
            <ScrollReveal><div id="calibration-dance" className="scroll-mt-20"><CalibrationDance /></div></ScrollReveal>
          </div>
        </div>
      </section>

      {/* Communication & Reporting */}
      <section className="py-12 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-2">Communication & Reporting</h2>
            <p className="text-muted-foreground text-sm mb-8">Translating model results into responsible, decision-relevant communication.</p>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><div id="stakeholder-translation" className="scroll-mt-20"><StakeholderTranslation /></div></ScrollReveal>
            <ScrollReveal><div id="report-card" className="scroll-mt-20"><ReportCard /></div></ScrollReveal>
            <ScrollReveal><div id="software-translation" className="scroll-mt-20"><SoftwareTranslationPanels /></div></ScrollReveal>
          </div>
        </div>
      </section>

      {/* Historical Context */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-2">Historical Context</h2>
            <p className="text-muted-foreground text-sm mb-8">How modeling philosophy has evolved — and why James's rules endure.</p>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><div id="philosophy-evolution" className="scroll-mt-20"><PhilosophyEvolution /></div></ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Animations;
