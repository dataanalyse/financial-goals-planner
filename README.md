# Financial Goals Planner (PlanFinanceToday)

A Next.js app for personal financial planning, live at **[planfinancetoday.com](https://www.planfinancetoday.com/)**.

## Features

- **Retirement Goals** — projected savings growth based on stock/bond allocation, with a chart of balance vs. contributions vs. growth
- **Home Buying** — timeline to save a down payment given home price, savings rate, and target percentage
- **Emergency Fund** — months needed to build a safety net covering a target number of months of expenses
- **Kids Financial Course** — a 10-week financial literacy course for teens (ages 13-16), covering topics from "What is Money?" to investing fundamentals. Weeks 1-8 are implemented as standalone components in [app/components/education/](app/components/education/); progress and earned badges are tracked via `localStorage`
- **Vacation Fund** — planned, not yet implemented

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4
- [Recharts](https://recharts.org/) for charts
- [Lucide React](https://lucide.dev/) for icons

## Project Structure

- [app/page.tsx](app/page.tsx) — main app shell, tab navigation, and the retirement/home/emergency calculators
- [app/components/education/](app/components/education/) — one component per course week (`Week1Component.tsx`–`Week8Component.tsx`)
- [app/components/shared/](app/components/shared/) — reusable UI: `Badge`, `LessonComponent`, `ProgressBar`, `QuizEngine`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

The repo is connected to [Vercel](https://vercel.com), which auto-deploys to [planfinancetoday.com](https://www.planfinancetoday.com/) on every push to `main`. No manual deploy step is needed.
