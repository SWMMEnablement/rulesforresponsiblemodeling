import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Initialize mermaid for the current colour scheme. With theme:'default' the edge
    // strokes are near-black and vanish on the dark background.
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "default",
      securityLevel: 'strict',
      fontFamily: 'inherit',
    });

    const renderDiagram = async () => {
      if (elementRef.current && chart) {
        try {
          setError(null);
          // Clear previous content
          elementRef.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
          
          // Render the mermaid diagram
          const { svg } = await mermaid.render(id, chart.trim());
          elementRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
          setError(error instanceof Error ? error.message : 'Unknown error');
          elementRef.current.innerHTML = `<div class="text-destructive p-4 border border-destructive/50 rounded-md">
            <p class="font-semibold">Error rendering diagram</p>
            <p class="text-sm mt-2">${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>`;
        }
      }
    };

    renderDiagram();
  }, [chart, resolvedTheme]);

  return <div ref={elementRef} className="flex justify-center my-4 w-full" />;
};
