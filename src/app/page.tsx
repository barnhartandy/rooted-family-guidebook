import Link from "next/link";

function WheatIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Central stalk */}
      <path d="M12 22V8" />
      {/* Wheat grains - alternating left and right */}
      <path d="M8 4c1.5 0 3 1 4 3" />
      <path d="M16 4c-1.5 0-3 1-4 3" />
      <path d="M7.5 7.5c1.5-.5 3 0 4.5 2" />
      <path d="M16.5 7.5c-1.5-.5-3 0-4.5 2" />
      <path d="M7 11c1.5-.5 3 0 5 1.5" />
      <path d="M17 11c-1.5-.5-3 0-5 1.5" />
      <path d="M8 14.5c1.2-.3 2.5 0 4 1" />
      <path d="M16 14.5c-1.2-.3-2.5 0-4 1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const valueProps = [
  {
    title: "Personalized to Your Family",
    description:
      "No two families are alike. Your guidebook is built around your children's ages, your values, and the questions keeping you up at night.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Grounded, Not Alarmist",
    description:
      "We skip the fear-mongering. Instead, you get thoughtful, research-backed guidance that meets your family exactly where you are.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Actionable from Day One",
    description:
      "This isn't a book that sits on a shelf. It's a living guide with conversation starters, screen-time frameworks, and age-specific strategies.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
];

const includedItems = [
  "A family values & technology assessment",
  "Age-specific AI literacy guides for each child",
  "Conversation starters for hard topics",
  "Screen time & device boundaries framework",
  "AI tool recommendations (and what to avoid)",
  "A family media agreement template",
  "Quarterly check-in prompts as your kids grow",
  "Access to future guidebook updates",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <WheatIcon className="h-6 w-6 text-sage-600" />
          <span className="font-serif text-lg font-semibold text-warm-800">
            Rooted Family
          </span>
        </div>
        <Link
          href="/questionnaire"
          className="text-sm font-medium text-warm-600 transition-colors hover:text-terra"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-sage-600">
            A personalized field guide for your family
          </p>
          <h1 className="font-serif text-4xl font-medium leading-tight text-warm-900 md:text-5xl lg:text-6xl">
            The Rooted Family
            <br />
            Guidebook
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-warm-600 md:text-xl">
            Navigate the age of AI with confidence, connection, and a plan that
            fits your family&mdash;not someone else&rsquo;s.
          </p>
          <div className="mt-10">
            <Link
              href="/questionnaire"
              className="inline-block rounded-full bg-terra px-8 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md"
            >
              Build Your Family&rsquo;s Guidebook
            </Link>
          </div>
          <p className="mt-4 text-sm text-warm-400">
            Takes about 5 minutes. No account required.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="h-px w-24 bg-warm-200" />
      </div>

      {/* Value Propositions */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium text-warm-900 md:text-4xl">
            Parenting in the age of AI
            <br className="hidden md:block" /> shouldn&rsquo;t feel overwhelming
          </h2>
          <p className="mt-4 text-lg text-warm-500">
            We believe every family deserves a thoughtful, personalized approach.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-12">
          {valueProps.map((prop) => (
            <div key={prop.title} className="text-center md:text-left">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-warm-100 text-sage-600">
                {prop.icon}
              </div>
              <h3 className="font-serif text-xl font-medium text-warm-800">
                {prop.title}
              </h3>
              <p className="mt-2 leading-relaxed text-warm-500">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="h-px w-24 bg-warm-200" />
      </div>

      {/* What's Included */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="font-serif text-3xl font-medium text-warm-900 md:text-4xl">
              Everything you need,
              <br />
              nothing you don&rsquo;t
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-warm-500">
              Your guidebook is assembled based on your family&rsquo;s unique
              answers&mdash;so every section is relevant to your life right now.
            </p>
            <div className="mt-8">
              <Link
                href="/questionnaire"
                className="inline-block rounded-full bg-terra px-8 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md"
              >
                Build Your Family&rsquo;s Guidebook
              </Link>
            </div>
          </div>
          <ul className="space-y-4">
            {includedItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-600/10">
                  <CheckIcon className="h-3.5 w-3.5 text-sage-700" />
                </span>
                <span className="text-warm-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="h-px w-24 bg-warm-200" />
      </div>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-serif text-3xl font-medium text-warm-900 md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-warm-500">
            One guidebook. One price. No subscriptions.
          </p>

          <div className="mt-12 rounded-2xl border border-warm-200 bg-white p-8 shadow-sm md:p-12">
            <p className="text-sm font-medium uppercase tracking-widest text-sage-600">
              The Rooted Family Guidebook
            </p>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="font-serif text-5xl font-medium text-warm-900">
                $39
              </span>
            </div>
            <p className="mt-2 text-warm-400">One-time purchase</p>
            <div className="mx-auto my-8 h-px w-full bg-warm-100" />
            <ul className="mx-auto space-y-3 text-left">
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" />
                <span className="text-warm-600">
                  Personalized to your family
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" />
                <span className="text-warm-600">
                  Instant digital delivery
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" />
                <span className="text-warm-600">
                  Free updates as AI evolves
                </span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/questionnaire"
                className="inline-block w-full rounded-full bg-terra px-8 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-terra-dark hover:shadow-md"
              >
                Build Your Family&rsquo;s Guidebook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200 bg-warm-100/50">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <WheatIcon className="h-5 w-5 text-sage-600" />
              <span className="font-serif text-lg font-semibold text-warm-800">
                Rooted Family
              </span>
            </div>
            <p className="text-sm text-warm-400">
              &copy; {new Date().getFullYear()} The Rooted Family Guidebook. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
