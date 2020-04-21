//      ___      .__   __. ____    ____      _______. _______ .__   __.  _______   _______ .______
//     /   \     |  \ |  | \   \  /   /     /       ||   ____||  \ |  | |       \ |   ____||   _  \
//    /  ^  \    |   \|  |  \   \/   /     |   (----`|  |__   |   \|  | |  .--.  ||  |__   |  |_)  |
//   /  /_\  \   |  . `  |   \_    _/       \   \    |   __|  |  . `  | |  |  |  ||   __|  |      /
//  /  _____  \  |  |\   |     |  |  __ .----)   |   |  |____ |  |\   | |  '--'  ||  |____ |  |\  \----.
// /__/     \__\ |__| \__|     |__| (__)|_______/    |_______||__| \__| |_______/ |_______|| _| `._____|
//                          ______   ______   .___  ___. .______    __
//                         /      | /  __  \  |   \/   | |   _  \  |  |
//                        |  ,----'|  |  |  | |  \  /  | |  |_)  | |  |
//                        |  |     |  |  |  | |  |\/|  | |   ___/  |  |
//                        |  `----.|  `--'  | |  |  |  | |  |      |__|
//                         \______| \______/  |__|  |__| | _|      (__)

import { ethers, Wallet } from "ethers";
import { Provider } from "ethers/providers";

import {
  sendToAnySender,
  watchRelayTx,
  onchainDepositFor,
  getAnySenderBalance,
  consolelog,
} from "./utils";
import {
  INFURA_PROJECT_ID,
  ORACLE_MNEMONIC,
  NETWORK_NAME,
  DEPOSIT_CONFIRMATIONS,
  ORACLE_CONTRACT_ADDRESS,
} from "./config";
import { parseEther } from "ethers/utils";
import { CommunityOracleFactory } from "../typedContracts/CommunityOracleFactory";

/**
 * Set up the provider and wallet
 */
async function setup() {
  const infuraProvider = new ethers.providers.InfuraProvider(
    NETWORK_NAME,
    INFURA_PROJECT_ID
  );

  const userMnemonicWallet = ethers.Wallet.fromMnemonic(ORACLE_MNEMONIC);
  const user = userMnemonicWallet.connect(infuraProvider);

  return {
    user,
    provider: infuraProvider,
  };
}

/**
 * Submit beacon to oracle contract
 * @param message Message to submit
 * @param user User's wallet
 * @param provider InfuraProvider
 * @param oracleCon Oracle Contract
 */
async function sendBeacon(
  beacon: string,
  user: Wallet,
  provider: Provider,
  oracleCon: ethers.Contract
) {
  // Encode function and call data
  const callData = oracleCon.interface.functions.submitBeacon.encode([beacon]);

  // Submits beacon to any.sender
  const { relayTx } = await sendToAnySender(
    oracleCon,
    callData,
    user,
    provider
  );

  // Wait for transaction to get mined
  const totalWait = await watchRelayTx(relayTx, user, provider);
  consolelog("Relay transaction confirmed after " + totalWait + " blocks");
  const processed = await oracleCon.oracleSubmitted(user.address);
  consolelog(
    "Oracle contract has received your beacon submission: " + processed
  );
}

/**
 * We have filled in most of the program for you.
 * Go to sendTicket() to fill in the blanks.
 */
(async () => {
  // ricmoo this is ur fault
  console.log = () => {};

  // Sanity check the config.ts is filled in.
  if (ORACLE_MNEMONIC.length === 0 || INFURA_PROJECT_ID.length === 0) {
    consolelog(
      "Please open config.ts and fill in ORACLE_MNEMONIC / INFURA_PROJECT_ID"
    );
    return;
  }

  // Set up wallets & provider
  const { user, provider } = await setup();

  // Get CyberDice contract
  const oracleCon = new CommunityOracleFactory(user).attach(
    ORACLE_CONTRACT_ADDRESS
  );

  consolelog(
    "*** You are running the oracle submission script on " +
      NETWORK_NAME +
      " ***"
  );

  consolelog("Your wallet address: " + user.address);

  const registered = await oracleCon.appointedOracle(user.address);
  consolelog("Registered as an appointed oracle: " + registered);

  const submitted = await oracleCon.oracleSubmitted(user.address);
  consolelog("Have you already submitted? " + submitted);

  // Sanity check minimum balance.
  const bal = await provider.getBalance(user.address);
  if (bal.lt(parseEther("0.01"))) {
    consolelog(
      "Your balance is " +
        bal.toString() +
        ". Please top it up to 0.01 eth or more."
    );
    return;
  }

  // We need to wait for on-chain confirmations before any.sender
  // accepts the deposit.
  consolelog(
    "Sending on-chain deposit - wait ~" +
      DEPOSIT_CONFIRMATIONS +
      " confirmations"
  );
  await onchainDepositFor(parseEther("0.009"), user);

  // What is the user's any.sender balance?
  const balance = await getAnySenderBalance(user);
  consolelog("Balance on any.sender: " + balance.toString() + " wei");

  // Send ticket to any.sender
  await sendBeacon("123", user, provider, oracleCon);
})().catch((e) => {
  consolelog(e);
  // Deal with the fact the chain failed
});
