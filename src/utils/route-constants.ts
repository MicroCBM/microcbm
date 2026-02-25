export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LINKEDIN: "/linkedin",
  HELP: "/help",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/sign-up",
    RESET_PASSWORD: "/auth/reset",
  },
  RCA: "/rca",
  RCA_NEW: "/rca/new",
  RCA_VIEW: (id: string) => `/rca/${id}`,
};
