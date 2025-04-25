// src/lib/api-endpoints.ts
export const BASE_URL= process.env.NEXT_PUBLIC_BASE_URL

export const USERS_API = `${BASE_URL}/user/users`;
export const PAYMENTS_API = `${BASE_URL}/user/payments`;
export const USER_BALANCE_API = `${BASE_URL}/user/balance`;
export const ADD_BALANCE_API = `${BASE_URL}/user/add-balance`;
export const PRICING_API = `${BASE_URL}/user/pricing`;
export const EMBEDDED_USERS_API = `${BASE_URL}/user/embedded-users`;
export const INSERT_USER_API = `${BASE_URL}/user/insert-user`;
export const TEMPLATES_API = `${BASE_URL}/templates/get-templates`;
export const NUMBER_REPORT_API = `${BASE_URL}/wa/number-report`;
export const INCOMING_MESSAGES_API = `${BASE_URL}/wa/incoming-messages`;
export const LOGIN_API = `${BASE_URL}/auth/login`;

