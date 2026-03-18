# Athletics Sports Club · Static React App (Vite)

This project is a static React application built with Vite for the Athletics Sports Club domain.

It was intentionally implemented without backend APIs. All domain data is mocked in local JSON files and loaded into component state with `useState`.

## 1) What you need before running

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- A terminal (PowerShell, CMD, or Bash)

Check versions:

```bash
node -v
npm -v
```

## 2) Run locally from scratch (exact steps)

1. Clone the repository.
2. Open a terminal in the project root.
3. Install dependencies.
4. Start the development server.
5. Open the app in the browser.

Commands:

```bash
git clone <your-repo-url>
cd volley\ front
npm install
npm run dev
```

Vite should print a local URL, typically:

```text
http://localhost:5173/
```

## 3) Useful scripts

```bash
npm run dev     # start local dev server
npm run lint    # run ESLint checks
npm run build   # create production build in /dist
npm run preview # preview the production build locally
```

## 4) Project scope (for grading)

- Stack: React + TypeScript + Vite
- Architecture: functional components with parent/child prop flow
- State management: local React state (`useState`, `useMemo`)
- Data source: local JSON imports (no `fetch`, no backend)
- Styling: external CSS (no heavy inline styling)
- Semantics: semantic HTML tags in page/component structure
- Navigation: `react-router-dom` implemented (extra-credit requirement)

## 5) Planning and design deliverables

The planning artifacts are included in [phase1-static-delivery](phase1-static-delivery):

- [phase1-static-delivery/user-stories-workflow-mockup.svg](phase1-static-delivery/user-stories-workflow-mockup.svg)
- [phase1-static-delivery/user-stories.md](phase1-static-delivery/user-stories.md)
- [phase1-static-delivery/stylebook.md](phase1-static-delivery/stylebook.md)
- [phase1-static-delivery/component-hierarchy-map.md](phase1-static-delivery/component-hierarchy-map.md)
- [phase1-static-delivery/chm.svg](phase1-static-delivery/chm.svg)

## 6) Main component hierarchy

```text
App
	MainLayout
		Header
		Outlet
			HomePage
			AthletesPage
				AthleteList
					AthleteCard
			TryoutBookingPage
				TryoutBookingForm
			CoachesPage
				CoachDirectory
			NotFoundPage
		Footer
```

## 7) Quick grading checks (teacher guide)

### User Story 1 (Tryout booking)

Route: `/tryouts`

- Submit without selecting values -> validation error message.
- Select a full session (`Track Speed Assessment`) -> alternative ending error:
	"No seats left for this session. Please choose another date."
- Valid booking -> confirmation + local seat decrement.
- Cancel button -> cancellation ending and form reset.

### User Story 2 (Athlete filtering)

Route: `/athletes`

- Filter by discipline and add/remove shortlist entries.
- Select `Swimming` category -> empty state:
	"No athletes match the selected filter."

## 8) Notes

- `node_modules` is required to run Vite locally (tooling only, not a backend).
- No server-side code is used for this phase.
