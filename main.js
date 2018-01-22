const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block minded: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, new Date().toLocaleDateString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // check hash of current block is correct
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('Current block has invalid hash!!!');
                console.log('Current hash: ' + currentBlock.hash);
                console.log('Calculated hash: ' + currentBlock.calculateHash());
                console.log(JSON.stringify(currentBlock, null, 4));
                return false;
            }


            // check current blocks previous block hash is correct
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('Current block has invalid previous hash!!!');
                console.log(JSON.stringify(currentBlock, null, 4));
                return false;
            }
        }

        return true;
    }
}

let jCoin = new BlockChain();

console.log('Mining block 1...');
jCoin.addBlock(new Block(1, new Date().toLocaleDateString(), { amount: 4 }));
console.log('Is blockchain valid? ' + jCoin.isChainValid());

console.log('Mining block 2...');
jCoin.addBlock(new Block(2, new Date().toLocaleDateString(), { amount: 10 }));
console.log('Is blockchain valid? ' + jCoin.isChainValid());