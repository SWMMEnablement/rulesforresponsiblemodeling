import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { SoftwareExamples } from "@/components/SoftwareExamples";
import { ApplicationChallenge, chapterChallenges } from "@/components/ApplicationChallenge";
import { ModernAnnotation, chapterAnnotations } from "@/components/ModernAnnotation";

const Chapter14 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={14} title="Parameter Optimization">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={14} />
        </div>
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Parameter optimization is essential for calibrating hydrological models. This chapter focuses on genetic algorithms (GA) 
            as a powerful optimization technique that mimics natural selection to find optimal parameter sets. 
            <GlossaryTooltip term="Multi-Objective Optimization" /> enables exploration of <GlossaryTooltip term="Pareto-Optimal Solution">Pareto-optimal solutions</GlossaryTooltip> 
            that balance competing <GlossaryTooltip term="Objective Function">objective functions</GlossaryTooltip>.
          </p>
        </section>

        {/* Genetic Algorithm Process */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Genetic Algorithm Optimization Process</h2>
          
          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Start: Initialize Population] --> B[Generate Random Parameter Sets]
    B --> C[Evaluate Fitness Function]
    C --> D[Convergence Criteria Met]
    D --No--> E[Selection]
    E --> F[Select Best Performers]
    F --> G[Crossover]
    G --> H[Combine Parent Parameters]
    H --> I[Mutation]
    I --> J[Random Parameter Variations]
    J --> K[Create New Generation]
    K --> C
    D --Yes--> L[Return Optimal Parameters]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#8b5cf6,stroke:#7c3aed,color:#fff
            `} />
          </Card>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-3">Key Components</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Population:</strong> Set of candidate solutions (parameter sets)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Fitness Function:</strong> <GlossaryTooltip term="Objective Function" /> measuring model performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Selection:</strong> Choosing best-performing individuals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Crossover:</strong> Combining parameters from parents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Mutation:</strong> Random variations for diversity</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-3">Advantages</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <span>Global optimization capability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <span>Handles non-linear, multi-modal problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <span>No gradient information required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <span>Robust to noisy data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">✓</span>
                  <span>Parallel evaluation possible</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Implementation Example */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Implementation Concept</h2>
          <Card className="p-6 bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">
{`// Pseudocode for Genetic Algorithm Calibration

function geneticAlgorithmOptimization(model, observations):
    // Initialize
    population = generateRandomParameterSets(populationSize)
    generation = 0
    
    while not converged and generation < maxGenerations:
        // Evaluate fitness
        for each parameterSet in population:
            predictions = model.run(parameterSet)
            fitness[parameterSet] = evaluateObjectiveFunction(
                predictions, 
                observations
            )
        
        // Selection - Tournament or Roulette
        parents = selectBestPerformers(population, fitness)
        
        // Crossover - Create offspring
        offspring = []
        for i in range(0, len(parents), 2):
            child1, child2 = crossover(parents[i], parents[i+1])
            offspring.append(child1)
            offspring.append(child2)
        
        // Mutation - Introduce variation
        for child in offspring:
            if random() < mutationRate:
                mutate(child)
        
        // Replace population
        population = selectNextGeneration(parents, offspring)
        generation += 1
    
    return bestParameterSet(population, fitness)`}
              </code>
            </pre>
          </Card>
        </section>

        {/* Parameter Encoding */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Parameter Encoding Strategy</h2>
          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Real Parameters] --> B[Binary Encoding]
    A --> C[Real-Value Encoding]
    A --> D[Gray Encoding]
    
    B --> E[Bit String 01101010]
    C --> F[Direct Values 0.25, 1.7, 0.8]
    D --> G[Gray Code Reduced Mutation Impact]
    
    E --> H[Crossover & Mutation]
    F --> H
    G --> H
    
    H --> I[Decoded Parameters]
    I --> J[Model Simulation]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
            `} />
          </Card>
        </section>

        {/* Multi-Objective Optimization */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Multi-Objective Optimization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            In hydrological modeling, we often need to optimize multiple competing objectives simultaneously, 
            such as peak flow accuracy, volume conservation, and timing precision.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Multiple Objectives] --> B[Peak Flow Accuracy]
    A --> C[Volume Conservation]
    A --> D[Timing Precision]
    A --> E[Low Flow Simulation]
    
    B --> F[Pareto Front Generation]
    C --> F
    D --> F
    E --> F
    
    F --> G[Decision Making]
    G --> H[Weighted Sum]
    G --> I[Constraint Method]
    G --> J[Interactive Selection]
    
    H --> K[Final Solution]
    I --> K
    J --> K
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style F fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff
            `} />
          </Card>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Calibration Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-foreground mb-3">Do's</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Use diverse initial population</li>
                <li>✓ <GlossaryTooltip term="Validation">Validate</GlossaryTooltip> with independent data</li>
                <li>✓ Monitor convergence carefully</li>
                <li>✓ Use appropriate <GlossaryTooltip term="Objective Function">fitness functions</GlossaryTooltip></li>
                <li>✓ Consider parameter ranges</li>
                <li>✓ Run multiple optimizations</li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-destructive">
              <h3 className="text-xl font-bold text-foreground mb-3">Don'ts</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✗ Over-calibrate to noise</li>
                <li>✗ Use single objective blindly</li>
                <li>✗ Ignore physical constraints</li>
                <li>✗ Stop at local optimum</li>
                <li>✗ Neglect <GlossaryTooltip term="Uncertainty Analysis">uncertainty</GlossaryTooltip></li>
                <li>✗ Skip <GlossaryTooltip term="Validation">validation</GlossaryTooltip> step</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Genetic algorithms provide robust global optimization for complex parameter spaces</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Multi-objective optimization reveals trade-offs between competing goals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Proper validation with independent data is essential for reliable models</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Parameter uncertainty should be quantified and communicated</span>
            </li>
          </ul>

          <Card className="p-6 bg-background/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Parameter Optimization</h3>
            <p className="text-muted-foreground italic mb-3">
              "Optimization is a powerful tool, but it is not magic. A well-optimized poor model 
              will still give poor predictions. Optimization should follow, not replace, careful 
              model construction and should always be accompanied by uncertainty analysis of the 
              resulting parameter values."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James emphasized that optimization algorithms find the best parameters for a given 
              model structure, but cannot compensate for structural inadequacy. The modeler must first 
              ensure the model represents essential physics before investing effort in optimization.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "How do genetic algorithms work?",
                options: [
                  "By random guessing",
                  "By mimicking natural selection and evolution",
                  "By exhaustive search",
                  "By linear programming"
                ],
                correctAnswer: 1,
                explanation: "Genetic algorithms mimic natural selection, using operations like selection, crossover, and mutation to evolve better solutions over generations."
              },
              {
                question: "What is a fitness function in genetic algorithms?",
                options: [
                  "Exercise routine",
                  "Measure of how well a solution performs",
                  "Computer processing speed",
                  "Data quality metric"
                ],
                correctAnswer: 1,
                explanation: "The fitness function evaluates how well each solution performs relative to the objectives, guiding the selection process toward better solutions."
              },
              {
                question: "What is crossover in genetic algorithms?",
                options: [
                  "Deleting solutions",
                  "Combining parts of parent solutions to create offspring",
                  "Random mutation",
                  "Final optimization step"
                ],
                correctAnswer: 1,
                explanation: "Crossover combines genetic information from two parent solutions to create offspring solutions, allowing good traits to be shared and combined."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter14;
