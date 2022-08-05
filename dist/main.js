"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
class Block {
    constructor(createdDate, data, prevHash = "") {
        this.createdDate = createdDate;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return (0, crypto_js_1.SHA256)(this.createdDate +
            this.prevHash +
            JSON.stringify(this.data) +
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
        this.difficulty = 5;
    }
    createGenesisBlock() {
        return new Block(new Date(), "test");
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
console.log("Mining block 1 ...");
CCH_coin.addBlock(new Block(new Date(), "Block 1"));
console.log("Mining block 2 ...");
CCH_coin.addBlock(new Block(new Date(), "Block 2"));
