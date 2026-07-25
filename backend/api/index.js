// Vercel serverless entry point.
// Local dev still uses Server.js (npm run dev) — this file is only used
// when deployed on Vercel, which needs a handler it can call per-request
// instead of a long-running app.listen() server.
import app from "../app.js";

export default app;
