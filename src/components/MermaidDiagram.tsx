import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const renderDiagram = async () => {
      if (elementRef.current && chart) {
        try {
          setError(null);
          // Clear previous content
          elementRef.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
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
  }, [chart]);

  return <div ref={elementRef} className="flex justify-center my-4 w-full" />;
};
