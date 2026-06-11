import 'dotenv/config';

// ENVIRONMENT
export const ENVIRONMENT =
  process.env.ENVIRONMENT || 'UAT';

  // CLIENT
export const CLIENT =
  process.env.CLIENT_NAME || 'GreenLife Hospitals';

    // CLIENT
export const SUPPLIER =
  process.env.SUPPLIER_NAME || 'HealthEquip Solutions Ltd';

// BASE URLS
export const BASE_URLS = {
  DEV: process.env.DEV_URL!,
  UAT: process.env.UAT_URL!,
};

// ACTIVE BASE URL
export const BASE_URL =
  BASE_URLS[
    ENVIRONMENT as keyof typeof BASE_URLS
  ];

// ADMIN CREDENTIALS
export const ADMIN_CREDENTIALS = {
  DEV: {
    username: process.env.DEV_ADMIN_USERNAME!,
    password: process.env.DEV_ADMIN_PASSWORD!,
  },

  UAT: {
    username: process.env.UAT_ADMIN_USERNAME!,
    password: process.env.UAT_ADMIN_PASSWORD!,
  },
};

// APPROVER CREDENTIALS
export const APPROVER_CREDENTIALS = {
  DEV: {
    username:
      process.env.DEV_APPROVER_USERNAME!,

    password:
      process.env.DEV_APPROVER_PASSWORD!,
  },

  UAT: {
    username:
      process.env.UAT_APPROVER_USERNAME!,

    password:
      process.env.UAT_APPROVER_PASSWORD!,
  },
};

// ACTIVE ADMIN
export const ADMIN_ACTIVE_CREDENTIALS =
  ADMIN_CREDENTIALS[
    ENVIRONMENT as keyof typeof ADMIN_CREDENTIALS
  ];

// ACTIVE APPROVER
export const APPROVER_ACTIVE_CREDENTIALS =
  APPROVER_CREDENTIALS[
    ENVIRONMENT as keyof typeof APPROVER_CREDENTIALS
  ];

// MFA
export const MFA = {
  admin: process.env.ADMIN_MFA_SECRET!,
  APPROVER: process.env.APPROVER_MFA_SECRET!,
};