import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Home',
    iconName: 'home',
    route: 'home',
  },
  {
    displayName: 'Program information',
    iconName: 'heartbeat',
    route: 'program',
    ddType: '',
    children: [
      {
        displayName: 'About',
        iconName: '',
        route: 'program/about',
      },
      {
        displayName: 'Program Resources',
        iconName: '',
        route: 'program/resources',
      },
      {
        displayName: 'FAQs',
        iconName: '',
        route: 'program/faqs',
      }
    ],
  },
  {
    displayName: 'My patients',
    iconName: 'user-heart',
    route: 'patients',
    ddType: '',
    children: [
      {
        displayName: 'Patient dashboard',
        iconName: '',
        route: 'patients/dashboard',
      },
      {
        displayName: 'Enrol patient',
        iconName: '',
        route: 'patients/enrol',
      }
    ],
  },
  {
    displayName: 'About OFEV',
    iconName: '',
    route: 'ofev',
    ddType: '',
    children: [
      {
        displayName: 'Product information',
        iconName: '',
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        external: true,
      },
      {
        displayName: 'Consumer information',
        iconName: '',
        route: 'https://rss.medsinfo.com.au/by/cmi.cfm?product=bycofevc',
        external: true,
      }
    ],
  },
];
