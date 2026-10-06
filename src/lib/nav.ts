// Site navigation. `live: false` items are hidden until their page exists,
// so the placeholder site never links to a 404. Flip to true as pages ship.
export type NavItem = { label: string; href: string; live: boolean };

export const mainNav: NavItem[] = [
  { label: "Investing", href: "/investing", live: false },
  { label: "First building", href: "/first-building", live: false },
  { label: "Selling", href: "/selling", live: false },
  { label: "Charleston areas", href: "/charleston", live: false },
  { label: "About", href: "/about", live: false },
];

export const sendTheDeal: NavItem = { label: "Send me the deal", href: "/send-the-deal", live: true };

export const footerQuestions: NavItem[] = [
  { label: "Investor-friendly agent in Charleston", href: "/investor-friendly-agent-charleston", live: false },
  { label: "What is a Charleston single house", href: "/what-is-a-charleston-single-house", live: false },
  { label: "House hacking in Charleston", href: "/house-hacking-charleston", live: false },
  { label: "SC 4% vs. 6% property tax", href: "/sc-property-tax-4-vs-6-percent", live: false },
  { label: "Buying from out of state", href: "/buying-charleston-rental-property-from-out-of-state", live: false },
];

export const privacyLink: NavItem = { label: "Privacy", href: "/privacy", live: true };

export const live = (items: NavItem[]) => items.filter((i) => i.live);

// Pages linked from inside page copy (homepage sections, CTAs). Same rule: no link until the page exists.
export const pageLinks = {
  investing: { label: "Investing", href: "/investing", live: false },
  firstBuilding: { label: "Your first building", href: "/first-building", live: false },
  selling: { label: "Selling", href: "/selling", live: false },
  areas: { label: "See the areas", href: "/charleston", live: false },
  grid: { label: "Next event", href: "/grid", live: false },
} satisfies Record<string, NavItem>;
