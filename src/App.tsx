import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Chapter3 from "./pages/Chapter3";
import Chapter4 from "./pages/Chapter4";
import Chapter5 from "./pages/Chapter5";
import Chapter6 from "./pages/Chapter6";
import Chapter7 from "./pages/Chapter7";
import Chapter8 from "./pages/Chapter8";
import Chapter9 from "./pages/Chapter9";
import Chapter10 from "./pages/Chapter10";
import Chapter11 from "./pages/Chapter11";
import Chapter12 from "./pages/Chapter12";
import Chapter13 from "./pages/Chapter13";
import Chapter14 from "./pages/Chapter14";
import Chapter15 from "./pages/Chapter15";
import Chapter16 from "./pages/Chapter16";
import Chapter17 from "./pages/Chapter17";
import AllNotes from "./pages/AllNotes";
import AboutAuthor from "./pages/AboutAuthor";
import Resources from "./pages/Resources";
import Glossary from "./pages/Glossary";
import StudyGuide from "./pages/StudyGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
