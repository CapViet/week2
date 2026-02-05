import "dotenv/config";
import * as appInsights from "applicationinsights";


appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true,true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setSendLiveMetrics(true)
  .start();


import express from "express";
import cors from "cors";
import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { requireAuth } from "./middleware/requireAuth";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const {
  OIDC_ISSUER,
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_REDIRECT_URI,
  FRONTEND_URL,
  JWT_SECRET,
} = process.env;

if (
  !OIDC_ISSUER ||
  !OIDC_CLIENT_ID ||
  !OIDC_CLIENT_SECRET ||
  !OIDC_REDIRECT_URI ||
  !FRONTEND_URL ||
  !JWT_SECRET
) {
  throw new Error("Missing required env variables");
}

app.use(express.json());

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "http://localhost:5173",
      "https://week1-openid.vercel.app",
    ],
    credentials: true,
  })
);

// --------------------
// HEALTH
// --------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --------------------
// 1) REDIRECT TO MINDX LOGIN
// --------------------
app.get("/auth/login", (_req, res) => {
  const params = qs.stringify({
    client_id: OIDC_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: OIDC_REDIRECT_URI,
    state: "mindx",
    prompt: "login",
  });

  // ✅ MindX authorization endpoint
  res.redirect(`${OIDC_ISSUER}/auth?${params}`);
});

// --------------------
// 2) CALLBACK FROM MINDX
// --------------------
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    // ✅ client_secret_post (works for all MindX clients)
    const tokenRes = await axios.post(
      `${OIDC_ISSUER}/token`,
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: OIDC_REDIRECT_URI,
        client_id: OIDC_CLIENT_ID,
        client_secret: OIDC_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const idToken = tokenRes.data.id_token;
    const decoded: any = jwt.decode(idToken);

    const appToken = jwt.sign(
      {
        id: decoded.sub,
        email: decoded.email || "",
        name: decoded.name || "MindX User",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Redirect back to frontend with app token
    res.redirect(`${FRONTEND_URL}/login-success?token=${appToken}`);
  } catch (err: any) {
    console.error("OIDC TOKEN ERROR:", err.response?.data || err.message);
    res.status(500).send("OIDC login failed");
  }
});

// --------------------
// PROTECTED
// --------------------
app.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "Protected",
    user: (req as any).user,
  });
});

// --------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});

// temporary crash test endpoint
app.get("/crash", (req, res) => {
    setInterval(() => {
    try {
      throw new Error("ALERT LOOP");
    } catch (e) {
      appInsights.defaultClient.trackException({
        exception: e as Error
      });
    }
  }, 5000);
});

// temporary latency test endpoint
app.get("/slow", async (req, res) => {
  await new Promise(r => setTimeout(r, 3000));
  res.send("Slow response");
});
