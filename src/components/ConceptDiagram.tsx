export const ConceptDiagram = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          The Framework for Responsible Modeling
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Key concepts and their interconnections
        </p>
        
        <div className="bg-card rounded-2xl p-8 border border-border shadow-[var(--shadow-card)]">
          <svg viewBox="0 0 800 600" className="w-full h-auto">
            {/* Center circle - Core Model */}
            <circle cx="400" cy="300" r="70" fill="hsl(var(--primary))" opacity="0.9" />
            <text x="400" y="295" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
              Reliable
            </text>
            <text x="400" y="315" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
              Model
            </text>
            
            {/* Outer concepts */}
            {[
              { angle: 0, label: "Data", subLabel: "Reliability", color: "hsl(var(--primary-light))" },
              { angle: 51.4, label: "Optimal", subLabel: "Complexity", color: "hsl(var(--secondary))" },
              { angle: 102.8, label: "Parameter", subLabel: "Optimization", color: "hsl(var(--primary))" },
              { angle: 154.2, label: "Uncertainty", subLabel: "Analysis", color: "hsl(var(--secondary-light))" },
              { angle: 205.6, label: "Sensitivity", subLabel: "Testing", color: "hsl(var(--primary-light))" },
              { angle: 257, label: "Performance", subLabel: "Evaluation", color: "hsl(var(--secondary))" },
              { angle: 308.4, label: "Model", subLabel: "Validation", color: "hsl(var(--primary))" }
            ].map((item, i) => {
              const rad = (item.angle * Math.PI) / 180;
              const x = 400 + Math.cos(rad) * 220;
              const y = 300 + Math.sin(rad) * 220;
              const lineEndX = 400 + Math.cos(rad) * 140;
              const lineEndY = 300 + Math.sin(rad) * 140;
              
              return (
                <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Connection line */}
                  <line 
                    x1={lineEndX} 
                    y1={lineEndY} 
                    x2={x} 
                    y2={y} 
                    stroke="hsl(var(--border))" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  
                  {/* Outer circle */}
                  <circle cx={x} cy={y} r="60" fill={item.color} opacity="0.9" />
                  
                  {/* Text */}
                  <text x={x} y={y - 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
                    {item.label}
                  </text>
                  <text x={x} y={y + 12} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
                    {item.subLabel}
                  </text>
                </g>
              );
            })}
            
            {/* Inner ring connecting concepts */}
            <circle 
              cx="400" 
              cy="300" 
              r="140" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              strokeDasharray="10,5"
              opacity="0.3"
            />
          </svg>
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-3xl font-bold text-primary mb-2">7</div>
            <div className="text-sm text-muted-foreground">Key Components</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-3xl font-bold text-secondary mb-2">∞</div>
            <div className="text-sm text-muted-foreground">Interconnections</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="text-3xl font-bold text-primary-light mb-2">1</div>
            <div className="text-sm text-muted-foreground">Unified Framework</div>
          </div>
        </div>
      </div>
    </section>
  );
};
