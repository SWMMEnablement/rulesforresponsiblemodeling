import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use dangerouslySetInnerHTML equivalent for custom elements
    if (elementRef.current) {
      const lovMermaid = document.createElement('lov-mermaid');
      lovMermaid.textContent = chart;
      elementRef.current.appendChild(lovMermaid);
    }
  }, [chart]);

  return <div ref={elementRef} />;
};
