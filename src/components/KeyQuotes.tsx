import { Quote } from "lucide-react";

export const KeyQuotes = () => {
  const quotes = [
    {
      text: "All models are wrong, though some may be said to be useful.",
      author: "G.E. Box",
      color: "primary"
    },
    {
      text: "Things should be made as simple as possible, but not any simpler.",
      author: "Albert Einstein",
      color: "secondary"
    },
    {
      text: "It's not enough to merely know when a model may be said to be useful - it's important to know how reliable it is.",
      author: "William James",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Guiding Principles
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className={`w-8 h-8 mb-4 ${quote.color === 'primary' ? 'text-primary' : 'text-secondary'} opacity-50`} />
              
              <p className="text-lg mb-4 text-foreground leading-relaxed">
                "{quote.text}"
              </p>
              
              <p className="text-sm font-medium text-muted-foreground">
                — {quote.author}
              </p>
              
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                quote.color === 'primary' 
                  ? 'from-primary/5 to-transparent' 
                  : 'from-secondary/5 to-transparent'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
