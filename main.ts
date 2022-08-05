import { SHA256 } from "crypto-js";

class Block {
    createdDate: Date;
    data: any;
    hash: string;
    prevHash: string;

    constructor(createdDate: Date, data: any, prevHash: string = "") {
        this.createdDate = createdDate;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.createdDate + this.prevHash + JSON.stringify(this.data)
        ).toString();
    }
}

class BlockChain {
    chain: Block[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(new Date(), "test");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock: Block) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (curBlock.calculateHash() !== curBlock.hash) return false;
            if (curBlock.prevHash !== prevBlock.hash) return false;
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

// Change data a block in blockchain
CCH_coin.chain[1].data = "change";
console.log("Is blockchain valid? ", CCH_coin.isChainValid());

// Change data and rehash a block in blockchain
CCH_coin.chain[2].data = "change";
CCH_coin.chain[2].hash = CCH_coin.chain[2].calculateHash();
console.log("Is blockchain valid? ", CCH_coin.isChainValid());
