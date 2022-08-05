"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(createdDate, transactions, prevHash = "") {
        this.createdDate = createdDate;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mỗi lần hash lại ta cần có 1 giá trị thay đổi để kết quả hash khác nhau
    }
    calculateHash() {
        return (0, crypto_js_1.SHA256)(this.createdDate +
            this.prevHash +
            JSON.stringify(this.transactions) +
            this.nonce).toString();
    }
    // What if user create new block continuously?
    // Then we have a solution call Mine. Wait the hash algorithm return a predefine string
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}
class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }
    minePedingTransactions(miningRewardAddress) {
        let block = new Block(new Date(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block successful mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction("", miningRewardAddress, this.miningReward),
        ];
    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
    getBalaceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    createGenesisBlock() {
        return new Block(new Date(), []);
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if (curBlock.calculateHash() !== curBlock.hash)
                return false;
            if (curBlock.prevHash !== prevBlock.hash)
                return false;
        }
        return true;
    }
}
let CCH_coin = new BlockChain();
CCH_coin.createTransaction(new Transaction("address1", "address2", 100));
CCH_coin.createTransaction(new Transaction("address2", "address1", 900));
console.log("Starting mining ...");
CCH_coin.minePedingTransactions("admin-address");
console.log("Starting mining again ...");
CCH_coin.minePedingTransactions("admin-address");
console.log("Starting mining again ...");
CCH_coin.minePedingTransactions("admin-address2");
console.log("Starting mining again ...");
CCH_coin.minePedingTransactions("admin-address");
console.log("Balance of admin address", CCH_coin.getBalaceOfAddress("admin-address"));
console.log("Balance of address1", CCH_coin.getBalaceOfAddress("address1"));
console.log("Balance of address2", CCH_coin.getBalaceOfAddress("address2"));
console.log(CCH_coin.chain[1]);
