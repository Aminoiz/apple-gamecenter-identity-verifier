export interface Token {
  playerId: string;
  publicKeyUrl: string;
  timestamp: number;
  signature: string;
  salt: string;
  bundleId: string;
}
