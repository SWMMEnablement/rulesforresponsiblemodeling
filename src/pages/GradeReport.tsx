import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ClipboardCheck, CircleDot, FlaskConical, History } from "lucide-react";
import { CHECKS_AS_OF, CHECKS_PASSING, OPEN_FINDINGS, REVIEWS } from "@/data/reviewLog";

const fmtDate = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

const GradeReport = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Review Log | Rules for Responsible Modeling</title>
      <meta name="description" content="Dated outside reviews, automatic checks and open findings for the interactive edition of Rules for Responsible Modeling." />
    </Helmet>
    <Navigation />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Review Log</h1>
        </div>
        <p className="text-muted-foreground">
          What outside reviewers found, when, and what is still open. Scores are the reviewers' own, for the version they saw.
          The app does not grade itself. An earlier version of this page showed a fixed 94/100 self-assessment and a 99% "content fidelity" claim; both were removed on {fmtDate("2026-11-02")} because nothing verifiable supported them.
        </p>
        <p className="text-sm text-muted-foreground">
          The original publication link points to a CHI web page that describes itself as incomplete and taken from a 1993 file, so it cannot confirm how faithfully the app follows the 2005 edition.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><FlaskConical className="w-6 h-6 text-primary" /> Automatic checks</h2>
        <Card className="p-5 text-sm text-muted-foreground">
          On {fmtDate(CHECKS_AS_OF)}, <strong className="text-foreground">{CHECKS_PASSING} automatic checks</strong> passed. They cover calculator mathematics, the
          model builder's input files, reproducible ensembles, the worked case's rules (continuity, seeds, per-run pipe capacity, session saving), and Ask James citations.
          They test calculations, not the accuracy of the book's content. Changes are listed on <Link to="/whats-new" className="text-primary underline">What's New</Link>.
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><CircleDot className="w-6 h-6 text-warning" /> Open findings</h2>
        <Card className="divide-y">
          {OPEN_FINDINGS.map((f) => (
            <div key={f.finding} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="font-medium text-foreground text-sm">{f.finding}</span>
              <span className="text-xs text-muted-foreground sm:text-right">{f.blocker}</span>
            </div>
          ))}
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><History className="w-6 h-6 text-primary" /> Outside reviews</h2>
        <ol className="space-y-4">
          {REVIEWS.map((r, i) => (
            <li key={`${r.date}-${i}`}>
              <Card className="p-5 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <time dateTime={r.date} className="text-sm font-semibold text-foreground">{fmtDate(r.date)}</time>
                  <span className="text-sm text-muted-foreground">· {r.reviewer}</span>
                  {r.score && <Badge variant="outline">{r.score}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">Scope: {r.scope}</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-0.5">
                  {r.findings.map((f) => <li key={f}>{f}</li>)}
                </ul>
                {i === 0 && <p className="text-xs text-muted-foreground">Status: the six findings above were addressed on {fmtDate("2026-11-02")}; see What's New.</p>}
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </main>
    <Footer />
  </div>
);

export default GradeReport;
