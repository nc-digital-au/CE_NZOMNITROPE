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
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
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
    prescriber: {
      register: `/${routeNames.authentication}/${routeNames.prescriber}/${routeNames.register}`,
    },
    account: {
      forgotPassword: `/${routeNames.authentication}/${routeNames.account}/${routeNames.forgotPassword}`,
      resetPassword: `/${routeNames.authentication}/${routeNames.account}/${routeNames.resetPassword}`,
      register: `/${routeNames.authentication}/${routeNames.account}/${routeNames.register}`,
    },
  },
  landing: `/${routeNames.landing}`,
  patients: {
    dashboard: `/${routeNames.patients}/${routeNames.dashboard}`,
    enrol: `/${routeNames.patients}/${routeNames.enrol}`,
    reapprove: `/${routeNames.patients}/${routeNames.reapprove}`,
  },
};