import { SHA256 } from "crypto-js";
import { ec } from "elliptic";
import { EC } from "./keygenerator";

export class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    signature: string;

    constructor(fromAddress: string, toAddress: string, amount: number) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(
            this.fromAddress + this.toAddress + this.amount
        ).toString();
    }

    signTransaction(signingKey: ec.KeyPair) {
        if (signingKey.getPublic("hex") !== this.fromAddress) {
            throw new Error("You cannot sign transactions for other wallets");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.fromAddress === "") return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction");
        }

        const publicKey = EC.keyFromPublic(this.fromAddress, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export class Block {
    createdDate: Date;
    transactions: Transaction[];
    hash: string;
    prevHash: string;
    nonce: number;

    constructor(
        createdDate: Date,
        transactions: Transaction[],
        prevHash: string = ""
    ) {
        this.createdDate = createdDate;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mỗi lần hash lại ta cần có 1 giá trị thay đổi để kết quả hash khác nhau
    }

    calculateHash() {
        return SHA256(
            this.createdDate +
                this.prevHash +
                JSON.stringify(this.transactions) +
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

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

export class BlockChain {
    difficulty: number;
    chain: Block[];
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }

    minePedingTransactions(miningRewardAddress: string) {
        let block = new Block(new Date(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successful mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction("", miningRewardAddress, this.miningReward),
        ];
    }

    createTransaction(transaction: Transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to address");
        }

        if (!transaction.isValid()) {
            throw new Error("Can not add invalid transaction to chain");
        }

        this.pendingTransactions.push(transaction);
    }

    // In reality, we don't really have a wallet balance
    // All transactions is stored in block
    // If someone ask for balance, we have to go through all transactions
    // that involve their address and calculate the balance
    getBalaceOfAddress(address: string) {
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

    addBlock(newBlock: Block) {
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (!curBlock.hasValidTransactions()) return false;

            if (curBlock.calculateHash() !== curBlock.hash) return false;
            if (curBlock.prevHash !== prevBlock.hash) return false;
        }
        return true;
    }
}
