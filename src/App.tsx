import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { AIChatWidget } from "@/components/AIChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
const Chapter1 = lazy(() => import("./pages/Chapter1"));
const Chapter2 = lazy(() => import("./pages/Chapter2"));
const Chapter3 = lazy(() => import("./pages/Chapter3"));
const Chapter4 = lazy(() => import("./pages/Chapter4"));
const Chapter5 = lazy(() => import("./pages/Chapter5"));
const Chapter6 = lazy(() => import("./pages/Chapter6"));
const Chapter7 = lazy(() => import("./pages/Chapter7"));
const Chapter8 = lazy(() => import("./pages/Chapter8"));
const Chapter9 = lazy(() => import("./pages/Chapter9"));
const Chapter10 = lazy(() => import("./pages/Chapter10"));
const Chapter11 = lazy(() => import("./pages/Chapter11"));
const Chapter12 = lazy(() => import("./pages/Chapter12"));
const Chapter13 = lazy(() => import("./pages/Chapter13"));
const Chapter14 = lazy(() => import("./pages/Chapter14"));
const Chapter15 = lazy(() => import("./pages/Chapter15"));
const Chapter16 = lazy(() => import("./pages/Chapter16"));
const Chapter17 = lazy(() => import("./pages/Chapter17"));
const AllNotes = lazy(() => import("./pages/AllNotes"));
const CodeLibrary = lazy(() => import("./pages/CodeLibrary"));
const AboutAuthor = lazy(() => import("./pages/AboutAuthor"));
const Resources = lazy(() => import("./pages/Resources"));
const Glossary = lazy(() => import("./pages/Glossary"));
const StudyGuide = lazy(() => import("./pages/StudyGuide"));
const KeyQuotes = lazy(() => import("./pages/KeyQuotes"));
const CaseVignettes = lazy(() => import("./pages/CaseVignettes"));
const PhDThesis = lazy(() => import("./pages/PhDThesis"));
const ResponsibilityQuiz = lazy(() => import("./pages/ResponsibilityQuiz"));
const ModelAutopsiesPage = lazy(() => import("./pages/ModelAutopsies"));
const MicroAppsIndex = lazy(() => import("./pages/MicroApps").then((m) => ({ default: m.MicroAppsIndex })));
const MicroAppPage = lazy(() => import("./pages/MicroApps").then((m) => ({ default: m.MicroAppPage })));
const GradeReport = lazy(() => import("./pages/GradeReport"));
const Animations = lazy(() => import("./pages/Animations"));
const Progress = lazy(() => import("./pages/Progress"));
const CrossReference = lazy(() => import("./pages/CrossReference"));
const Playground = lazy(() => import("./pages/Playground"));
const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CommandPalette />
          <AIChatWidget />
          {/* Route-level code splitting: the eager build shipped one 3.1 MB chunk (jspdf,
              mermaid, recharts and all 17 chapters) to every visitor. */}
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chapter/1" element={<Chapter1 />} />
            <Route path="/chapter/2" element={<Chapter2 />} />
            <Route path="/chapter/3" element={<Chapter3 />} />
            <Route path="/chapter/4" element={<Chapter4 />} />
            <Route path="/chapter/5" element={<Chapter5 />} />
            <Route path="/chapter/6" element={<Chapter6 />} />
            <Route path="/chapter/7" element={<Chapter7 />} />
            <Route path="/chapter/8" element={<Chapter8 />} />
            <Route path="/chapter/9" element={<Chapter9 />} />
            <Route path="/chapter/10" element={<Chapter10 />} />
            <Route path="/chapter/11" element={<Chapter11 />} />
            <Route path="/chapter/12" element={<Chapter12 />} />
            <Route path="/chapter/13" element={<Chapter13 />} />
            <Route path="/chapter/14" element={<Chapter14 />} />
            <Route path="/chapter/15" element={<Chapter15 />} />
            <Route path="/chapter/16" element={<Chapter16 />} />
            <Route path="/chapter/17" element={<Chapter17 />} />
            <Route path="/notes" element={<AllNotes />} />
            <Route path="/about-author" element={<AboutAuthor />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/study-guide" element={<StudyGuide />} />
            <Route path="/key-quotes" element={<KeyQuotes />} />
            <Route path="/case-vignettes" element={<CaseVignettes />} />
            <Route path="/code-library" element={<CodeLibrary />} />
            <Route path="/phd-thesis" element={<PhDThesis />} />
            <Route path="/responsibility-quiz" element={<ResponsibilityQuiz />} />
            <Route path="/model-autopsies" element={<ModelAutopsiesPage />} />
            <Route path="/micro-apps" element={<MicroAppsIndex />} />
            <Route path="/micro-apps/:slug" element={<MicroAppPage />} />
            <Route path="/grade-report" element={<GradeReport />} />
            <Route path="/animations" element={<Animations />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/cross-reference" element={<CrossReference />} />
            <Route path="/playground" element={<Playground />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
