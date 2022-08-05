"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
class Block {
    constructor(createdDate, data, prevHash = "") {
        this.createdDate = createdDate;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return (0, crypto_js_1.SHA256)(this.createdDate + this.prevHash + JSON.stringify(this.data)).toString();
    }
}
class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block(new Date(), "test");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
CCH_coin.addBlock(new Block(new Date(), "cao chi hai"));
CCH_coin.addBlock(new Block(new Date(), "abc xyz"));
CCH_coin.addBlock(new Block(new Date(), "abc xyz"));
console.log(CCH_coin);
console.log("Is blockchain valid? ", CCH_coin.isChainValid());
// Change data of a block in blockchain
CCH_coin.chain[1].data = "change";
console.log("Is blockchain valid? ", CCH_coin.isChainValid());
CCH_coin.chain[2].data = "change";
CCH_coin.chain[2].hash = CCH_coin.chain[2].calculateHash();
console.log("Is blockchain valid? ", CCH_coin.isChainValid());
