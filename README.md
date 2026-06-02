# Rules for Responsible Modeling

A community-curated set of principles, conventions, and best practices for building defensible, transparent, and reproducible hydrologic and hydraulic models — with a focus on **SWMM5**, **EPANET**, and **InfoWorks ICM** workflows.

> "All models are wrong, but some are useful." — George E. P. Box
>
> Our job as modelers is to keep them useful, honest, and reproducible.

---

## Why This Repo Exists

Stormwater, sewer, and water-distribution models increasingly drive multi-million-dollar infrastructure decisions, regulatory submittals, and public-safety outcomes. Yet there is no single, vendor-neutral checklist for what "responsible" looks like in practice.

This repository collects:

- **Rules** — short, testable statements ("a model shall...").
- **Rationale** — why each rule exists, with references where possible.
- **Examples** — good and bad patterns drawn from real SWMM5 / EPANET / ICM projects.
- **Checklists** — printable QA/QC sheets for model reviewers.

---

## The Ten Core Rules

1. **Document the purpose.** Every model file shall state what question it is intended to answer. Models built for planning are not automatically valid for design.
2. **Preserve provenance.** Source data (LiDAR, as-builts, rainfall, monitoring) shall be cited with date, owner, and version.
3. **Version everything.** Input files, calibration parameters, and post-processing scripts belong in source control — not in `Final_v7_REAL_thisone.inp`.
4. **Calibrate before you conclude.** Report objective functions (NSE, PBIAS, RMSE) against observed flow, depth, or pressure data.
5. **Quantify uncertainty.** Sensitivity runs are not optional; they are the model.
6. **Respect numerical stability.** Continuity errors, routing time-steps, and convergence criteria shall be reported, not hidden.
7. **Separate calibration from validation data.** No peeking.
8. **Be explicit about assumptions.** Mannings n, initial losses, infiltration parameters, and boundary conditions shall be tabulated.
9. **Make results reproducible.** A peer shall be able to re-run your scenario from the repo and obtain identical numbers.
10. **Communicate honestly.** Confidence intervals, known limitations, and "do-not-use-for" statements belong in the executive summary, not the appendix.

---

## Repository Structure

```
/rules         Markdown files, one rule per file
/checklists    Reviewer checklists (PDF + MD source)
/examples      Annotated SWMM5 .inp and EPANET .net snippets
/references    Bibliography and external standards
/web           Lovable/Vite front-end for browsing the rules
```

---

## Contributing

Pull requests are welcome from practitioners, regulators, academics, and software vendors. Please:

1. Open an issue first to discuss proposed rules or revisions.
2. Keep each rule **atomic, testable, and tool-agnostic** where possible.
3. Cite published guidance (ASCE, WEF, EPA, CIWEM, WaPUG) when applicable.
4. Use the PR template; reviewers will check for clarity, evidence, and neutrality.

---

## Related Standards & Reading

- EPA SWMM 5 Reference Manual (Vols. I–III)
- WEF MOP-FD-19: *Alternative Sewer Systems*
- CIWEM UDG *Code of Practice for the Hydraulic Modelling of Urban Drainage Systems*
- ASCE Manual 77: *Design and Construction of Urban Stormwater Management Systems*
- Bennis & Crobeddu, *Numerical Modelling of Urban Drainage*

---

## License

Content is released under **CC BY 4.0**; any accompanying code under the **MIT License**. See `LICENSE` for details.

---

## Maintainers

SWMMEnablement — an open community of stormwater modelers committed to transparent practice.

*If you use these rules in a project, report, or RFP, we'd love to hear about it — open an issue and tell us.*
