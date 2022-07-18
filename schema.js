const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        trade(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Trade!]!
        order(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Order!]!
        ethereum: Ethereum
    }

    type Trade {
        date: String!
        time: String!
        sym: String!
        orderID: String!
        price: Float!
        size: Float!
        tradeID: String!
        side: String!        
        exchange: String!
    }

    type Order {
        date: String!
        time: String!
        sym: String!
        orderID: String!
        price: Float!
        size: Float!    
        side: String!
        action: String!
        orderType: String!
        exchange: String!
    }

    type Ethereum {
        account(address: String): Account
        transaction(hash: String): Transaction
        block(hash: String, number: Int): Block
    }

    type Account {
        address: String!
        balance: Float!
    }

    type Transaction {
        hash: String
        from: String
        to: String
        value: String
        gas: Int
        gasPrice: String
    }

    type Block {
        number: Int
        hash: String
        parentHash: String
        nonce: String
        sha3Uncles: String
        logsBloom: String
        transactionsRoot: String
        stateRoot: String
        miner: String
        difficulty: Int
        totalDifficulty: Int
        extraData: String
        size: Int
        gasLimit: Int
        gasUsed: Int
        timestamp: Int
        transactions: [Transaction]
    }
`;

module.exports = typeDefs;