import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

// Initialize mermaid with configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (elementRef.current) {
        try {
          // Clear previous content
          elementRef.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Render the mermaid diagram
          const { svg } = await mermaid.render(id, chart);
          elementRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
          elementRef.current.innerHTML = '<p class="text-destructive">Error rendering diagram</p>';
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div ref={elementRef} className="flex justify-center my-4" />;
};
