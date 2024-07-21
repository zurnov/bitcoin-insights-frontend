import { INavLink } from '../interfaces/navLink';

export const NAV_LINKS: INavLink[] = [
  { label: 'Home', route: '/' },
  { label: 'Donate', route: '/donate' },
  {
    label: 'GitHub Star',
    route: 'https://github.com/zurnov/bitcoin-insights-frontend/',
    external: true,
    icon: 'fas fa-star',
  },
];
