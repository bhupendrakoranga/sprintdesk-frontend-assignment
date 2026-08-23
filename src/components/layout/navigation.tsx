import { AnalyticsIcon, BoardIcon, DashboardIcon, type IconComponent } from '../../utils/icons';

interface NavigationItem {
  label: string;
  to: string;
  Icon: IconComponent;
}

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
  { label: "Board", to: "/board", Icon: BoardIcon },
  { label: "Analytics", to: "/analytics", Icon: AnalyticsIcon },
];
