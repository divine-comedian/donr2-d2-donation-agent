export interface DonationHandlerConfig {
  address: string;
  networkId: number;
}

export const DonationHandlerAddress: Record<string, DonationHandlerConfig> = {
  ALFAJORES: {
    address: "0xd363df3de223a73bd78fa27251ad213528bc2761",
    networkId: 44787
  }
} as const;

