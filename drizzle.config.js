import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "app/configs/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://ai-short-video-generator_owner:L2gRd7oZGXvD@ep-falling-bonus-a5sgor9e.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require",
  },
});
