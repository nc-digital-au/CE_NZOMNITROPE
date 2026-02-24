export const routeNames = {
  default: 'home',
  authentication: 'authentication',
  landing: 'landing',
  home: 'home',
  program: 'program',
  patients: 'patients',
  error: 'error',
  prescriber: 'prescriber',
  register: 'register',
  account: 'account',
  resetPassword: 'account/reset-password',
  dashboard: 'dashboard',
  enrol: 'enrol',
  reapprove: 'reapprove',
  order: 'order',
  resources: 'resources',
  schedule: 'schedule',
};

export const routeLinks = {
  authentication: {
    error: `/${routeNames.authentication}/${routeNames.error}`,
    register: `/${routeNames.authentication}/${routeNames.register}`,
    resetPassword: `/${routeNames.authentication}/${routeNames.resetPassword}`,
  },
  landing: `/${routeNames.landing}`,
  home: `/${routeNames.home}`,
  resources: {
    howToInject: `/${routeNames.resources}/how-to-inject`,
  },
  order: `/${routeNames.order}`,
  schedule: `/${routeNames.schedule}`,
};