# Architecture rules
- Wrap routes in HelmetProvider and Suspense; lazy-load secondary pages so metadata and loading states work without loading every tool initially.
- Keep the SWMM engine in a worker, read continuity errors from reports, and bound pending requests with timeouts because the bundled glue does not expose heap views.
- Keep calculator mathematics in testable pure helpers and present water-budget recharge separately from its baseflow partition to avoid double-counting.
- Only display chapter-related external articles after verifying their destinations, and label application-authored takeaways as paraphrases rather than source quotations.