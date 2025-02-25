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
        route: 'resources/how-to-inject',
      },
      {
        displayName: 'PDF Guide 1',
        iconName: '',
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        target: '_blank',
      },
      {
        displayName: 'PDF Guide 2',
        iconName: '',
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        target: '_blank',
      },
      {
        displayName: 'PDF Guide 3',
        iconName: '',
        route: 'https://rss.medsinfo.com.au/by/pi.cfm?product=bypofevc',
        target: '_blank',
      },
      {
        displayName: 'Omnitrope CMI',
        iconName: '',
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
