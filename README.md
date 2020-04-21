# Cyberdice Oracle 

One technical hitch we ran into when building the competition is that Ethereum cannot easily verify signatures generated with BLS12-381. 

So to work around the problem, we need a few "trusted" oracles to fetch the beacon for us from the League of Entropy.

Again, thank you very much for agreeng to be an oracle for our competition! 

## Edit the configuration file

You only need to edit 1 file:
- config.ts

You need to insert your 12-word seed:

```
export const ORACLE_MNEMONIC = "your twelve word seed must be entered here so lets do it"
```

(Make sure there are **NO spaces at the start or end of it!** And yes, you are using my infura ID). 

## Let's run the script 

First check if you have node and NPM installed:

```
node -v
npm -v
```

If either command didn't work, then install node & npm before continuing.

Next, you just have to run two commands:

```
npm i
npm run submitBeacon
```

Both commands install the project's dependencies (node_modules) and runs the script that sends the beacon to the CyberDice smart contract. 

If you have no funds in the wallet, then you will see this output:

```
Your wallet address: 0x733b6005F801B0Edc75da476edb3D3415281071E
Registered as an appointed oracle: false
Have you already submitted? false
Your balance is 0. Please top it up to 0.03 eth or more.
```

Please contact us with the wallet address and we will top it up with 0.03 eth! 

If all goes well, then hopefully you will see the following output: 

```
*** You are running the any.sender competition script on ropsten ***
Your wallet address: 0xDAE7c65D3d5D86A8963a0D56677Cdd1d11334454
Registered as an appointed oracle: true
Have you already submitted? false
Sending on-chain deposit - wait ~15 confirmations
https://ropsten.etherscan.io/tx/0x5435d9339c0bc658b8f199ac55d10b7ac0b1919a68d237dc5efe89c35d1cbc65
Balance on any.sender: 166394062439513998 wei
Checking for relayed transaction...
...
...
...
https://ropsten.etherscan.io/tx/0x79b23d5cf173f06bb49900a391bdea555fd1d278d7204c792c877b221336d0d1
Relay transaction confirmed after 2 blocks
Oracle contract has received your beacon submission: true
```

Before leaving, please make sure the following is printed:

```
Oracle contract has received your beacon submission: true
```

It confirms the beacon was received by the contract :)

## What is happening under the hood?

Our script connects to the league of entropy website to fetch the beacon. Then, it deposits 0.029 eth into the any.sender service and sends the beacon (via any.sender) to the Cyberdice contract. We use the \_msgSender() standard, so the contract will recognise the signer's address when processing the request. 

As you can see in the submitBeacon.ts code, it is fairly straight forward. Hopefully our competition will be a good example on how other projects can easily incorporate meta-transactions.

Again, thanks for helping with the competition! What makes Ethereum so special is that competitions like this can actually be deployed in real life. :) 
