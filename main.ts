import { BlockChain, Transaction } from "./blockchain";
import { EC } from "./keygenerator";

let CCH_coin = new BlockChain();

const myKey = EC.keyFromPrivate(
    "a47c2200074fe60612ff3e52d1dc03fdbbea637ba5819262b7055412e5bfdde5"
);
const myWalletAddress = myKey.getPublic("hex");

const tx1 = new Transaction(
    myWalletAddress,
    "someone else wallet address",
    100
);
tx1.signTransaction(myKey);
CCH_coin.createTransaction(tx1);

console.log("Starting mining ...");
CCH_coin.minePedingTransactions(myWalletAddress);

console.log(
    "Balance of admin address",
    CCH_coin.getBalaceOfAddress(myWalletAddress)
);

console.log("Is chain valid? ", CCH_coin.isChainValid());
