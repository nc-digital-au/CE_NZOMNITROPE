import { routeNames } from 'src/app/utils/routes';
import { NavItem } from './nav-item/nav-item';

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
    displayName: 'Order SurePal Device',
    displayNameLine2: '& Consumables',
    route: 'order',
  },
  {
    displayName: 'Schedule Injection',
    displayNameLine2: 'Training',
    route: 'schedule',
    ddType: '',
  },
  {
    displayName: 'Resources',
    route: 'resources',
    ddType: '',
    children: [
      {
        displayName: 'How to Inject Video',
        iconName: '',
        route: 'resources',
      },
      {
        displayName: 'SurePal 5mg How to use guide',
        iconName: '',
        external: true,
        route: '/assets/pdfs/Omnitrope5.pdf',
        target: '_blank',
        isPdf: true, 
      },
      {
        displayName: 'SurePal 10mg How to use guide',
        iconName: '',
        external: true,
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        target: '_blank',
      },
      {
        displayName: 'SurePal 15mg How to use guide',
        iconName: '',
        external: true,
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        target: '_blank',
      },
      {
        displayName: 'Omnitrope CMI',
        iconName: '',
        external: true,
        route: 'https://www.medsafe.govt.nz/Consumers/CMI/o/omnitrope.pdf',
        target: '_blank',
      }
    ],
  },
  {
    displayName: 'Logout',
    route: '',
    ddType: '',
  },
];
