import { Issuer, Client } from "openid-client";

let oidcClient: Client;

export async function initOIDC() {
  const issuer = await Issuer.discover(process.env.OIDC_ISSUER!);

  oidcClient = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID!,
    client_secret: process.env.OIDC_CLIENT_SECRET!,
    redirect_uris: [process.env.OIDC_REDIRECT_URI!],
    response_types: ["code"],
  });
}

export function getOIDCClient() {
  if (!oidcClient) {
    throw new Error("OIDC not initialized yet");
  }
  return oidcClient;
}
