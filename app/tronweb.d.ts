export interface TronWebAccount {
  address: {
    base58: string;
    hex: string;
  };
  privateKey: string;
  publicKey: string;
}

export interface TronWebContract {
  at: (address: string) => Promise<{
    symbol: () => { call: () => Promise<string> };
    name: () => { call: () => Promise<string> };
    decimals: () => { call: () => Promise<string> };
    balanceOf: (address: string) => { call: () => Promise<string> };
    transfer: (to: string, amount: string) => { send: () => Promise<{ txid: string }> };
  }>;
}

export interface TronWeb {
  ready: boolean;
  defaultAddress: {
    base58: string;
  };
  trx: {
    getAccount: (address: string) => Promise<{ balance?: string; trc20: Record<string, unknown> }>;
    sendTransaction: (to: string, amount: string) => Promise<{ txid: string }>;
  };
  contract: () => TronWebContract;
  toSun: (amount: string) => string;
  fromSun: (amount: string) => string;
  toBigNumber: (value: string | number) => {
    dividedBy: (divisor: number) => {
      toString: () => string;
    };
  };
  createAccount: () => Promise<TronWebAccount>;
  request: (params: { method: string }) => Promise<void>;
}

declare global {
  interface Window {
    tronWeb?: TronWeb;
  }
}

export {};