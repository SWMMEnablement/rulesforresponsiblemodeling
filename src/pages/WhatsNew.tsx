import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, History } from "lucide-react";
import { CHANGELOG, type ChangeKind } from "@/data/changelog";

const KIND_LABEL: Record<ChangeKind, string> = {
  feature: "New feature",
  tool: "New tool",
  content: "Content",
  fix: "Fix",
  accuracy: "Accuracy",
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function WhatsNew() {
  const [filter, setFilter] = useState<ChangeKind | "all">("all");

  const releases = useMemo(
    () =>
      CHANGELOG.map((r) => ({ ...r, items: filter === "all" ? r.items : r.items.filter((i) => i.kind === filter) }))
        .filter((r) => r.items.length > 0),
    [filter],
  );

  const years = useMemo(() => [...new Set(releases.map((r) => r.date.slice(0, 4)))], [releases]);
  const totalChanges = CHANGELOG.reduce((s, r) => s + r.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>What's New | Rules for Responsible Modeling</title>
        <meta name="description" content="A timeline of how the Rules for Responsible Modeling interactive edition has grown, from the first chapters to the SWMM Playground." />
      </Helmet>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-3">
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">What's New</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          How this interactive edition grew: {CHANGELOG.length} milestones and {totalChanges} changes since{" "}
          {fmtDate(CHANGELOG[CHANGELOG.length - 1].date)}.
        </p>

        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter changes">
          {(["all", ...Object.keys(KIND_LABEL)] as (ChangeKind | "all")[]).map((k) => (
            <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)} aria-pressed={filter === k}>
              {k === "all" ? "Everything" : KIND_LABEL[k]}
            </Button>
          ))}
        </div>

        {years.map((year) => (
          <section key={year} className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-6">{year}</h2>
            <ol className="relative border-l-2 border-border ml-2 space-y-8">
              {releases.filter((r) => r.date.startsWith(year)).map((r) => (
                <li key={r.date} className="pl-6 relative">
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background" aria-hidden />
                  <time dateTime={r.date} className="text-sm font-medium text-muted-foreground">{fmtDate(r.date)}</time>
                  <Card className="mt-2 p-5">
                    <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{r.summary}</p>
                    <ul className="space-y-2.5">
                      {r.items.map((item, i) => (
                        <li key={i} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3 text-sm">
                          <Badge variant={item.kind === "fix" || item.kind === "accuracy" ? "secondary" : "outline"} className="shrink-0 w-fit">
                            {KIND_LABEL[item.kind]}
                          </Badge>
                          <span className="text-foreground flex-1">
                            {item.text}
                            {item.link && (
                              <Link to={item.link} className="inline-flex items-center gap-0.5 ml-1.5 text-primary hover:underline">
                                Open <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
