import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "d667ad93efa4871be4bc516b9f9f27ccb9f0e49c88a0d7ae4eaa3a9c1998286a680453005deaecf93c6012b788edc3bd0cfd7f33f6c70df499e58cefc8454246",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/api/auth/google/callback",

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  GITHUB_CALLBACK_URL:
    process.env.GITHUB_CALLBACK_URL || "http://localhost:8000/api/auth/github/callback",

  SESSION_SECRET:
    process.env.SESSION_SECRET || "tikora-secure-session-secret-key-9992384729384",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "owvqdxdv",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "574239286367129",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "5WBNnY1ENBG1fAP92i9DHdu6xxM",

  CHAPA_PUBLIC_KEY: process.env.CHAPA_PUBLIC_KEY || "CHAPUBK_TEST-53bWKGtffzavn55Ony3OtBDAgFeiNuUG",
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-kWkkoI6YlIJm6m5zR6Z2ERwmuqKWanPQ",
  CHAPA_ENCRYPTION_KEY: process.env.CHAPA_ENCRYPTION_KEY || "fQBLoqrzkev7ErY671d6xpdn",
  CHAPA_BASE_URL: process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1",
  CHAPA_CALLBACK_URL:
    process.env.CHAPA_CALLBACK_URL || "http://localhost:3000/payments/webhook/chapa",
};

