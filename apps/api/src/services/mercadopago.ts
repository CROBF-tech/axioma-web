import { MercadoPagoConfig, PreApproval } from "mercadopago";

export function createMpClient(accessToken: string) {
  const client = new MercadoPagoConfig({ accessToken });
  return { preapproval: new PreApproval(client) };
}

export type MpClient = ReturnType<typeof createMpClient>;