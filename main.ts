import { SHA256 } from "crypto-js";

class Block {
    createdDate: Date;
    data: any;
    hash: string;
    prevHash: string;
    nonce: number;

    constructor(createdDate: Date, data: any, prevHash: string = "") {
        this.createdDate = createdDate;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mỗi lần hash lại ta cần có 1 giá trị thay đổi để kết quả hash khác nhau
    }

    calculateHash() {
        return SHA256(
            this.createdDate +
                this.prevHash +
                JSON.stringify(this.data) +
                this.nonce
        ).toString();
    }

    // What if user create new block continuously?
    // Then we have a solution call Mine. Wait the hash algorithm return a predefine string
    mineBlock(difficulty: number) {
        while (
            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    difficulty: number;
    chain: Block[];

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

    addBlock(newBlock: Block) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
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
console.log("Mining block 1 ...");
CCH_coin.addBlock(new Block(new Date(), "Block 1"));

console.log("Mining block 2 ...");
CCH_coin.addBlock(new Block(new Date(), "Block 2"));
