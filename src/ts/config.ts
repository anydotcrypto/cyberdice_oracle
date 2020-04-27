// any.sender API configuration
export const MINIMUM_ANYSENDER_DEADLINE = 410; // It is 400, but this provides some wiggle room.
export const ANYSENDER_RELAY_CONTRACT =
  "0xa404d1219Ed6Fe3cF2496534de2Af3ca17114b06"; // On-chain relay contract
export const ANYSENDER_API = "https://api.anydot.dev/any.sender.mainnet"; // API Link
export const RECEIPT_KEY = "0x02111c619c5b7e2aa5c1f5e09815be264d925422"; // Any.sender operator signing key
export const DEPOSIT_CONFIRMATIONS = 40; // Must wait this long before any.sender recognises deposit

// Oracle and Infura configuration
export const INFURA_PROJECT_ID = "";
export const NETWORK_NAME = "mainnet";
export const ORACLE_CONTRACT_ADDRESS = "";
export const ORACLE_MNEMONIC = ""; // Filled in by our competition script.

// League of Entropy
export const URLS = [
  "https://cryptoparty.london:1337/api/public/",
  "https://drand.cyberdice.nikkolasg.xyz:1969/api/public/",
  "https://drand.zerobyte.io:8765/api/public/",
];

export const ROUND_NUMBER = 800;
