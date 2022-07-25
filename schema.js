import {gql} from 'apollo-server';

const typeDefs = gql`
    type Query {
        "Recent trades"
        trade(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Trade!]!
        "Order book update events"
        order(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Order!]!
        "Raw on-chain data from Ethereum"
        ethereum: Ethereum
    }

    type Subscription {
        "Recent trades"
        trades(exchange: Exchange): LiveTrade
    }

    enum Exchange {
        APOLLOX,
        BINANCE,
        BITFINEX,
        BYBIT,
        COINBASE,
        DERIBIT,
        DYDX,
        FTX,
        HUOBI,
        KRAKEN,
        KUCOIN,
        OKEX,
        PHEMEX
    }

    type LiveTrade {
        "ID of the aggressor order, if provided"
        order_id: String
        "Price of the trade"
        price: Float
        "ID of the trade, if provided"
        trade_id: String
        "POSIX timestamp of the trade"
        timestamp: String
        "Side of the aggressor order -- 1 is buy, 2 is sell"
        side: Int
        "Size of the trade"
        size: Float
        "The original message carried along with the trade, if provided"
        msg_original_type: String
    } 

    type LiveLob {
        quote_no: Int
        event_no: Int
        order_id: String
        original_order_id: String,
        side: Int,
        price: Float,
        size: Float,
        lob_action: Int,
        event_timestamp: String,
        send_timestamp: String,
        receive_timestamp: String,
        order_type: Int,
        is_implied: Int,
        order_executed: Int,
        execution_price: Float,
        executed_size: Float,
        aggressor_side: Int,
        matching_order_id: String,
        old_order_id: String,
        trade_id: String,
        size_ahead: Float,
        orders_ahead: Int
    }

    type Trade {
        "Date of the trade"
        date: String!
        "Time of the trade"
        time: String!
        "Symbol of the trade"
        sym: String!
        "Order ID of the executed aggressor order for the trade (if provided)"
        orderID: String!
        "Price of the trade"
        price: Float!
        "Size of the trade"
        size: Float!
        "Trade ID (if provided)"
        tradeID: String!
        "Side of the aggressor"
        side: String!        
        "Exchange the trade occurred on"
        exchange: String!
    }

    type Order {
        "Date of the order"
        date: String!
        "Time of the order"
        time: String!
        "Symbol of the order"
        sym: String!
        "Order ID of the order"
        orderID: String!
        "Price of the order"
        price: Float!
        "Size of the order"
        size: Float!    
        "Side of the order"
        side: String!
        "The LOB event action"
        action: String!
        "Type of the order"
        orderType: String!
        "Exchange the order was placed on"
        exchange: String!
    }

    type Ethereum {
        "A specific Ethereum account"
        account(address: String): Account
        "A transaction on the Ethereum blockchain"
        transaction(hash: String): Transaction
        "A block on the Ethereum chain"
        block(hash: String, number: Int): Block
    }

    type Account {
        "The address of the account"
        address: String!
        "The ETH balance of the account"
        balance: Float!
    }

    type Transaction {
        "The hash of the transaction"
        hash: String
        "The sending address of the transaction"
        from: String
        "The receiving address of the transaction"
        to: String
        "The value of the transaction"
        value: String
        "The gas used by the transaction"
        gas: Int
        "The price of the gas for this transaction"
        gasPrice: String
        "The hash of the block this transaction is in"
        blockHash: String
        "The number of the block this transaction is in"
        blockNumber: Int
        "The ID for the specific chain this transaction is on"
        chainId: String
        "Data sent along with the transaction"
        input: String
        "Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas"
        maxFeePerGas: String
        "Maximum fee, in Wei, the sender is willing to pay per gas above the base fee"
        maxPriorityFeePerGas: String
        "The number of transactions made by the sender prior to this one"
        nonce: Int
        "ECDSA signature r"
        r: String
        "ECDSA signature s"
        s: String
        "Recovery ID for ECDSA"
        v: Int
        "Index of the transaction in the block"
        transactionIndex: Int
        "The transaction type"
        type: String
    }

    type Block {
        "The block number"
        number: Int
        "The hash of the block"
        hash: String
        "The hash of the parent block"
        parentHash: String
        "Hash of the proof-of-work"
        nonce: String
        "SHA3 of the uncles data in the block"
        sha3Uncles: String
        "The bloom filter for the logs of the block"
        logsBloom: String
        "The root of the transaction trie"
        transactionsRoot: String
        "The root of the final state trie"
        stateRoot: String
        "The root of the receipts trie"
        receiptsRoot: String
        "The address of the block miner"
        miner: String
        "The difficulty of the block, given as hexadecimal"
        difficulty: String
        "The total difficulty of the chain until this block"
        totalDifficulty: String
        "The 'extra data' field of the block"
        extraData: String
        "The size of the block in bytes"
        size: Int
        "The maximum gas allowed in this block"
        gasLimit: Int
        "The total used gas by all transactions in this block"
        gasUsed: Int
        "The timestamp of the block"
        timestamp: Int
        "An array of transaction objects for transactions that occured in this block"
        transactions: [Transaction]
    }
`;

export default typeDefs;