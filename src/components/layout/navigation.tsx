import type { ComponentType, SVGProps } from "react";

type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationItem {
  label: string;
  to: string;
  Icon: NavigationIcon;
}

const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4ZM13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z" />
  </svg>
);

const BoardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5h14M5 12h14M5 18.5h14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v15.5M12 4v15.5M17 4v15.5" />
  </svg>
);

const AnalyticsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16v-4M12 16V7M17 16v-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8.5 10 5l4 3 4-4" />
  </svg>
);

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
  { label: "Board", to: "/board", Icon: BoardIcon },
  { label: "Analytics", to: "/analytics", Icon: AnalyticsIcon },
];
