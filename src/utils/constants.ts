export const ENV_VARS = {
  API_BASE_URL: `${process.env.NEXT_PUBLIC_API_URL}` || "http://localhost:3000",
};

export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const isTesting = ENVIRONMENT === "test";
export const isDev = ENVIRONMENT === "development";
