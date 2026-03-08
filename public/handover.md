# Rules for Responsible Modeling — Application Handover Document

**Generated:** 2026-03-08  
**Live URL:** https://rulesforresponsiblemodeling.lovable.app  
**Platform:** Lovable (with Lovable Cloud backend)  
**Project ID:** fe4178a1-fca6-430b-bb84-dc1f3c67264b

---

## 1. Project Overview

**Rules for Responsible Modeling** is an interactive, educational web application that reimagines the book *"Rules for Responsible Modeling"* (4th Edition, 2005) by **Dr. William James, Ph.D., P.Eng.** The digital reinterpretation was created by **Robert Dickinson**, drawing on his 50-year career in water modeling.

The app transforms the original 17-chapter, 303-page technical textbook on deterministic modeling for urban water systems into a rich, navigable learning experience with interactive visualizations, quizzes, flashcards, AI chat, and study tools.

### Key Characteristics

| Attribute | Value |
|---|---|
| Subject Domain | Hydrological / urban water systems modeling |
| Target Audience | Water engineers, modelers, students, researchers |
| Content Source | William James's book + Robert Dickinson's interpretation |
| Authentication | None (public, unauthenticated) |
| Data Persistence | localStorage only (bookmarks, notes, quiz progress) |
| Backend | Lovable Cloud (Supabase) — used only for AI chat edge function |
| Hosting | Lovable managed hosting |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^18.3.1 |
| Language | TypeScript | ^5.8.3 (strict) |
| Build Tool | Vite | ^5.4.19 |
| Styling | Tailwind CSS | ^3.4.17 |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| Charts | Recharts | ^2.15.4 |
| Diagrams | Mermaid.js | ^11.12.1 |
| Routing | react-router-dom | ^6.30.1 |
| State Management | React Query (@tanstack/react-query) | ^5.83.0 |
| Theme | next-themes | ^0.3.0 |
| PDF Export | jsPDF | ^4.0.0 |
| Forms | react-hook-form + zod | ^7.61.1 / ^3.25.76 |
| Icons | lucide-react | ^0.462.0 |
| Backend SDK | @supabase/supabase-js | ^2.91.0 |
| Testing | Playwright | ^1.57.0 |
| Dev Plugin | lovable-tagger | ^1.1.11 |

### Build Configuration

- **Path alias:** `@` → `./src` (via `vite.config.ts` and `tsconfig.app.json`)
- **Dev server:** Port 8080, IPv6 host
- **React deduplication:** Configured in `vite.config.ts` via `resolve.dedupe`
- **Optimized deps:** react, react-dom, next-themes pre-bundled

---

## 3. Design System

### Color Tokens (HSL-based)

All colors are defined as CSS custom properties in `src/index.css` and consumed via `tailwind.config.ts`.

**Light Mode (`:root`)**
| Token | HSL Value | Usage |
|---|---|---|
| `--primary` | 200 95% 35% | Primary brand blue |
| `--primary-light` | 200 90% 50% | Hover / gradient endpoint |
| `--primary-dark` | 200 95% 25% | Active states |
| `--secondary` | 142 76% 36% | Green accents |
| `--background` | 210 40% 98% | Page background |
| `--foreground` | 215 25% 15% | Body text |
| `--muted` | 210 30% 94% | Subtle backgrounds |
| `--destructive` | 0 84.2% 60.2% | Error / warning |

**Dark Mode (`.dark`)** — Full dark palette defined with adjusted luminance values.

### Custom Design Tokens

```css
--gradient-hero: linear-gradient(135deg, hsl(200 95% 35%), hsl(200 95% 50%));
--shadow-card: 0 4px 20px -4px hsl(200 50% 40% / 0.15);
--shadow-hover: 0 8px 30px -6px hsl(200 50% 40% / 0.25);
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Tailwind Extensions

- Custom `sidebar-*` color tokens for sidebar component
- Border radius via `--radius: 0.75rem`
- Accordion animations (keyframes `accordion-down`/`accordion-up`)
- Plugin: `tailwindcss-animate`
- Dev dependency: `@tailwindcss/typography`

---

## 4. Application Architecture

### Routing Structure (`src/App.tsx`)

```
/                     → Index (Homepage)
/chapter/1..17        → Individual chapter pages (17 routes)
/study-guide          → Study Guide with flashcards, pathways, exercises
/key-quotes           → Key Quotes flashcard deck
/code-library         → Ruby/SWMM code examples
/responsibility-quiz  → Responsibility Score Quiz (full page)
/model-autopsies      → Model failure case studies
/animations           → 15 interactive conceptual animations
/glossary             → Searchable glossary
/resources            → External resources and references
/phd-thesis           → Goyen PhD Thesis handover documentation
/grade-report         → App self-assessment grade report
/about-author         → About William James
/notes                → All user notes (aggregated)
/case-vignettes       → Rules in Action stories
*                     → 404 Not Found
```

### Global Providers (wrapping all routes)

1. **QueryClientProvider** — React Query cache
2. **ThemeProvider** — Dark/light mode (next-themes, class strategy)
3. **TooltipProvider** — Global tooltip context
4. **Toaster** (shadcn) + **Sonner** — Toast notifications
5. **CommandPalette** — `Cmd+K` / `Ctrl+K` global search
6. **AIChatWidget** — Floating "Ask James" AI assistant

---

## 5. Page & Component Inventory

### Pages (`src/pages/`)

| File | Lines | Description |
|---|---|---|
| `Index.tsx` | 216 | Homepage — hero, personal intro, search, bookmarks, learning pathways, interactive tools, chapters |
| `Chapter1.tsx` – `Chapter17.tsx` | ~200–400 each | Individual chapter pages with content, quizzes, key takeaways |
| `StudyGuide.tsx` | 758 | Tabbed study guide: chapter guides, flashcards, reading pathways, mind map, exercises |
| `Animations.tsx` | 128 | 15 interactive animations with scroll-reveal and floating TOC |
| `GradeReport.tsx` | 345 | Self-assessment with category grades, excellent features, improvement suggestions |
| `Glossary.tsx` | — | Searchable glossary with tooltip definitions |
| `KeyQuotes.tsx` | — | Key quotes flashcard page |
| `CodeLibrary.tsx` | — | Ruby script examples with syntax highlighting |
| `Resources.tsx` | — | External links and references |
| `PhDThesis.tsx` | 233 | Allan Goyen PhD dissertation viewer documentation |
| `ResponsibilityQuiz.tsx` | — | Full-page responsibility score quiz |
| `ModelAutopsies.tsx` | — | Model failure analysis case studies |
| `CaseVignettes.tsx` | — | Real-world modeling stories |
| `AllNotes.tsx` | — | Aggregated view of all chapter notes |
| `AboutAuthor.tsx` | — | William James biography |
| `NotFound.tsx` | — | 404 page |

### Major Interactive Components (`src/components/`)

| Component | Purpose |
|---|---|
| `Navigation.tsx` | Sticky top nav with all page links, theme toggle, keyboard shortcuts modal, mobile sheet menu |
| `Hero.tsx` | Gradient hero banner with stats, links to original publication, source code dialog |
| `PersonalIntroduction.tsx` | Robert Dickinson's personal narrative and 50-year career context |
| `AIChatWidget.tsx` | Floating "Ask James" AI chatbot with streaming responses (274 lines) |
| `CommandPalette.tsx` | `Cmd+K` command palette searching chapters, glossary terms, quotes (208 lines) |
| `GlobalSearch.tsx` | Homepage search across all content |
| `ChapterLayout.tsx` | Shared layout wrapper for all 17 chapter pages |
| `ChapterCard.tsx` | Chapter preview card used on homepage |
| `Chapters.tsx` | Chapter grid for homepage |

### Educational / Interactive Components

| Component | Purpose |
|---|---|
| `FlashcardDeck.tsx` | Spaced-repetition flashcard system |
| `Flashcard.tsx` | Individual flip card |
| `Quiz.tsx` | Multiple-choice quiz component |
| `ResponsibilityScoreQuiz.tsx` | Scored responsibility assessment |
| `ReadingPathways.tsx` | Guided learning paths by experience level |
| `FrameworkDiagnostic.tsx` | Interactive diagnostic tool |
| `FrameworkMap.tsx` | Visual framework relationship map |
| `FrameworkMindMap.tsx` | Mind map of book concepts |
| `ChecklistGenerator.tsx` | Generate project-specific checklists |
| `ProjectTemplates.tsx` | Downloadable project templates |
| `ComplexitySimulator.tsx` | Complexity vs reliability interactive simulator |
| `ModelComparison.tsx` | Compare user's model against James's framework |
| `ModelAutopsies.tsx` | Model failure case studies |
| `CaseVignettes.tsx` | Real-world modeling vignettes |
| `SoftwareTranslationPanels.tsx` | SWMM5 / ICM translation panels |
| `SoftwareExamples.tsx` | Software implementation examples |
| `SoftwareExamplesSearch.tsx` | Searchable software examples |
| `KeyQuotes.tsx` | Notable quotes display |
| `KeyQuotesFlashcards.tsx` | Quote flashcard deck |
| `KeyTakeaways.tsx` | Chapter key takeaways |
| `KeyConcepts.tsx` | Core concepts overview |
| `ConceptDiagram.tsx` | Visual concept diagrams |
| `Timeline.tsx` | Historical timeline of modeling |
| `ModelingProcess.tsx` | Step-by-step modeling process |
| `RuleOfTheWeek.tsx` | Rotating featured rule |
| `OfficePosterSeries.tsx` | Downloadable poster designs |
| `CertificationBadge.tsx` | Gamification certification badge |
| `RelatedBlogPosts.tsx` | Related external content |
| `PDFReferenceCard.tsx` | PDF export reference card |
| `StakeholderTranslation.tsx` | Translate findings for stakeholders |

### Animation Components (15 total, on `/animations` page)

| Component | Concept Visualized |
|---|---|
| `ComplexitySimulator.tsx` | Complexity–Reliability Curve |
| `UncertaintyFunnel.tsx` | Uncertainty Propagation |
| `CalibrationVsValidation.tsx` | Overfitting Detection |
| `DataDecayTimeline.tsx` | Data Freshness Decay |
| `GarbageInGospelOut.tsx` | Garbage In, Gospel Out |
| `PrecisionIllusion.tsx` | Significant Figures Illusion |
| `SensitivitySpider.tsx` | Parameter Sensitivity Spider |
| `ConfidenceZones.tsx` | Model Confidence Zones |
| `CalibrationDance.tsx` | Parameter Interaction Dance |
| `EquifinalityProblem.tsx` | Equifinality Problem |
| `ReportCard.tsx` | Model Report Card |
| `RainGaugeDensity.tsx` | Rain Gauge Density Effect |
| `PhilosophyEvolution.tsx` | 1960s–AI Philosophy Timeline |
| `StakeholderTranslation.tsx` | Stakeholder Communication |
| `SoftwareTranslationPanels.tsx` | Software Translation |

Supporting: `AnimationsToc.tsx` (floating table of contents), `ScrollReveal.tsx` (intersection observer fade-in)

### Utility Components

| Component | Purpose |
|---|---|
| `BookmarkButton.tsx` | Toggle bookmark on chapters |
| `ChapterNotes.tsx` | Per-chapter note taking |
| `GlossaryTooltip.tsx` | Hover tooltip for glossary terms |
| `MermaidDiagram.tsx` | Render Mermaid.js diagrams |
| `RubySyntaxHighlighter.tsx` | Ruby code syntax highlighting |
| `SearchBar.tsx` | Reusable search input |
| `ShortcutsModal.tsx` | Keyboard shortcuts reference |
| `ModernAnnotation.tsx` | Text annotation component |
| `NavLink.tsx` | Navigation link helper |
| `ThemeProvider.tsx` | Theme context wrapper |
| `Footer.tsx` | Site footer with links |

### UI Primitives (`src/components/ui/`)

Full shadcn/ui component library (40+ components): accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip.

---

## 6. Data Layer

### Static Data Files (`src/data/`)

| File | Content |
|---|---|
| `flashcardData.ts` | Flashcard terms and definitions per chapter |
| `glossaryData.ts` | Glossary terms, definitions, and chapter references |
| `keyQuotesFlashcardData.ts` | Key quotes with attribution for flashcard deck |

### Client-Side Persistence (localStorage)

| Key | Hook | Data Stored |
|---|---|---|
| `chapter-bookmarks` | `useBookmarks.tsx` | Array of `{ chapterNumber, title, timestamp }` |
| `chapter-notes-*` | `useNotes.tsx` | Per-chapter text notes |
| `pathway-progress` | `usePathwayProgress.tsx` | Learning pathway completion status |
| `reading-progress` | `useReadingProgress.tsx` | Chapter reading progress |
| `spaced-repetition-*` | `useSpacedRepetition.tsx` | SM-2 algorithm card progress (`easeFactor`, `interval`, `repetitions`, `nextReview`) |

### No Database Tables

The Lovable Cloud (Supabase) project has **no database tables**. All user data is stored in the browser's localStorage. The backend is used exclusively for the AI chat edge function.

---

## 7. Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useBookmarks.tsx` | CRUD bookmarks in localStorage |
| `useNotes.tsx` | CRUD chapter notes in localStorage |
| `usePathwayProgress.tsx` | Track learning pathway completion |
| `useReadingProgress.tsx` | Track chapter reading progress |
| `useSpacedRepetition.tsx` | SM-2 spaced repetition algorithm for flashcards |
| `useTableOfContents.tsx` | Parse headings and track active heading for sidebar TOC |
| `useKeyboardShortcuts.tsx` | Global keyboard shortcut bindings |
| `use-mobile.tsx` | Responsive breakpoint detection |
| `use-toast.ts` | Toast notification hook (shadcn) |

---

## 8. Backend — Edge Functions

### `supabase/functions/chat/index.ts`

The only backend function. Powers the "Ask James" AI chatbot.

| Property | Value |
|---|---|
| Runtime | Deno (Supabase Edge Functions) |
| AI Model | `google/gemini-3-flash-preview` via Lovable AI Gateway |
| Authentication | Supabase anon key (public, no user auth required) |
| Streaming | Yes (SSE — Server-Sent Events) |
| System Prompt | Extensive prompt embodying Dr. William James's philosophy across all 17 chapters |
| Error Handling | 429 (rate limit), 402 (usage limit), 500 (general) |
| Secret Required | `LOVABLE_API_KEY` (auto-configured by Lovable Cloud) |

**System prompt covers:**
- All 17 chapter topics with descriptions
- 5 key modeling principles
- Response style guidelines (reference chapters, provide SWMM5/ICM examples, challenge assumptions)

---

## 9. Navigation & Keyboard Shortcuts

### Navigation Bar

Sticky top bar with links to all major pages. Responsive: full button bar on desktop, sheet (drawer) menu on mobile.

**Navigation items:**
Home, Study Guide, Key Quotes, Code Library, Quiz, Autopsies, Animations, Glossary, Resources, Goyen PhD Thesis, Grade Report, SWMM Explorer (external link to Replit)

### Command Palette (`Cmd+K` / `Ctrl+K`)

Searches across:
- All 17 chapters
- Glossary terms
- Key quotes
- Page navigation

### Keyboard Shortcuts

- `?` — Open shortcuts modal
- `D` — Toggle dark/light theme
- `Cmd+K` / `Ctrl+K` — Command palette

---

## 10. SEO & Meta

**`index.html` Configuration:**

```html
<title>Rules for Responsible Modeling | William James</title>
<meta name="description" content="A comprehensive guide to deterministic modeling for urban water systems..." />
<meta name="author" content="William James" />
<meta name="keywords" content="water modeling, hydraulic models, urban water systems..." />
```

- Open Graph tags configured (title, description, type, image)
- Twitter Card: `summary_large_image`
- OG image: Lovable default (`https://lovable.dev/opengraph-image-p98pqg.png`) — **should be replaced** with a custom image

---

## 11. Theme Support

Full light/dark mode via `next-themes` with `class` strategy on `<html>`.

- Default: `system` (follows OS preference)
- Toggle: Button in navigation bar
- Persistence: `next-themes` handles localStorage automatically
- All colors defined in both `:root` and `.dark` in `index.css`

---

## 12. External Links & Integrations

| Integration | URL / Details |
|---|---|
| Original Publication | https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html |
| SWMM Docs Explorer | https://replit.com/@robertdickinson/SWMM-Docs-Explorer |
| MD Insight Explorer | https://md-insight-explorer.lovable.app |
| Lovable AI Gateway | https://ai.gateway.lovable.dev/v1/chat/completions |

---

## 13. Static Assets

| File | Purpose |
|---|---|
| `public/favicon.ico` | Browser favicon |
| `public/placeholder.svg` | Placeholder image |
| `public/robots.txt` | Search engine crawling rules |
| `public/md-insight-explorer-handover.md` | Goyen PhD thesis project handover doc (downloadable) |

---

## 14. Testing

- **Framework:** Playwright (`@playwright/test ^1.57.0`)
- **Config:** `playwright.config.ts` and `playwright-fixture.ts`
- **Coverage:** Browser-based E2E tests

---

## 15. Known Limitations & Improvement Opportunities

### Current Limitations

1. **No user authentication** — All data is localStorage-only; lost on browser clear or device switch
2. **No full-text search** across chapter content (search is limited to structured data)
3. **OG image** is Lovable default — needs custom branded image
4. **No PDF export** of chapters (jsPDF installed but not deeply integrated)
5. **No offline support** / PWA capabilities
6. **StudyGuide.tsx is 758 lines** — should be refactored into smaller components
7. **GradeReport.tsx is 345 lines** — could benefit from extraction
8. **Footer** still references "Vibe APP" branding in some places

### Suggested Improvements

1. Add user authentication to persist bookmarks/notes/progress across devices
2. Implement full-text search across all 17 chapters
3. Create custom OG/social share image
4. Add PWA manifest for offline access
5. Implement chapter content as MDX or markdown files instead of JSX
6. Add analytics tracking for learning engagement
7. Refactor large page components (StudyGuide, GradeReport) into smaller pieces
8. Add print-friendly stylesheets
9. Internationalization support

---

## 16. File Structure Summary

```
├── index.html                          # Entry HTML with SEO meta
├── package.json                        # Dependencies & scripts
├── vite.config.ts                      # Vite build config with path aliases
├── tailwind.config.ts                  # Tailwind theme extensions
├── tsconfig.json / tsconfig.app.json   # TypeScript configuration
├── playwright.config.ts                # E2E test configuration
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   ├── handover.md                     # This file
│   └── md-insight-explorer-handover.md # Goyen PhD project docs
├── src/
│   ├── main.tsx                        # React entry point
│   ├── App.tsx                         # Router & providers
│   ├── App.css                         # Additional styles
│   ├── index.css                       # Design system tokens (light + dark)
│   ├── lib/utils.ts                    # cn() utility
│   ├── vite-env.d.ts                   # Vite type declarations
│   ├── components/
│   │   ├── Navigation.tsx              # Global navigation
│   │   ├── Hero.tsx                    # Homepage hero
│   │   ├── Footer.tsx                  # Site footer
│   │   ├── AIChatWidget.tsx            # AI chatbot (274 lines)
│   │   ├── CommandPalette.tsx          # Cmd+K search (208 lines)
│   │   ├── AnimationsToc.tsx           # Floating TOC for animations
│   │   ├── ScrollReveal.tsx            # Intersection observer reveal
│   │   ├── [50+ interactive components]
│   │   └── ui/                         # 40+ shadcn/ui primitives
│   ├── pages/
│   │   ├── Index.tsx                   # Homepage
│   │   ├── Chapter1.tsx – Chapter17.tsx
│   │   ├── Animations.tsx              # 15 animation gallery
│   │   ├── StudyGuide.tsx              # Study guide (758 lines)
│   │   ├── GradeReport.tsx             # Self-assessment (345 lines)
│   │   ├── [10+ additional pages]
│   │   └── NotFound.tsx                # 404
│   ├── data/
│   │   ├── flashcardData.ts
│   │   ├── glossaryData.ts
│   │   └── keyQuotesFlashcardData.ts
│   ├── hooks/
│   │   ├── useBookmarks.tsx
│   │   ├── useNotes.tsx
│   │   ├── usePathwayProgress.tsx
│   │   ├── useReadingProgress.tsx
│   │   ├── useSpacedRepetition.tsx
│   │   ├── useTableOfContents.tsx
│   │   ├── useKeyboardShortcuts.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── integrations/supabase/
│       ├── client.ts                   # Auto-generated Supabase client
│       └── types.ts                    # Auto-generated types (no tables)
└── supabase/
    ├── config.toml                     # Supabase project config
    └── functions/
        └── chat/
            └── index.ts                # AI chat edge function
```

---

## 17. Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Auto-configured | Backend API base URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Auto-configured | Anon key for API calls |
| `VITE_SUPABASE_PROJECT_ID` | Auto-configured | Project identifier |
| `LOVABLE_API_KEY` | Edge function secret | AI gateway authentication |

---

## 18. Deployment

The app is deployed via Lovable's managed hosting:

- **Published URL:** https://rulesforresponsiblemodeling.lovable.app
- **Build command:** `vite build`
- **Output:** `dist/` directory
- **Edge functions:** Auto-deployed from `supabase/functions/`

No CI/CD pipeline configuration needed — Lovable handles build and deployment automatically.

---

## 19. Migration Notes

To migrate this project to another hosting provider:

1. Export code via GitHub integration
2. Install all npm dependencies (`npm install`)
3. Set environment variables for Supabase URL and anon key
4. Deploy the `chat` edge function to your Supabase project
5. Ensure `LOVABLE_API_KEY` secret is configured (or replace with your own AI provider)
6. Update OG image URLs in `index.html`
7. Configure `vite.config.ts` path alias if needed
8. Build with `npm run build` and deploy `dist/` to any static host

---

## 20. Changelog

| Date | Change | Details |
|---|---|---|
| 2026-03-08 | Navigation title no-wrap fix | Added `whitespace-nowrap` and responsive `text-sm lg:text-lg` to the nav title in `Navigation.tsx` (line 48) to prevent "Rules for Responsible Modeling" from wrapping on smaller screens |
| 2026-03-08 | Handover document created | Comprehensive 19-section handover document added to `public/handover.md` |

---

*End of handover document.*
