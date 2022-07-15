const { ApolloServer, gql } = require('apollo-server');
const { response } = require('express');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const baseURL = `http://10.90.61.143:5005`

function getFilters(info) {
    var response = []
    user_functions = info.operation.selectionSet.selections
        for (let i = 0; i < user_functions.length; i++){
            if (user_functions[i].name.value===info.fieldName) {
                for (let j = 0; j < user_functions[i].selectionSet.selections.length; j++){
                    response.push(user_functions[i].selectionSet.selections[j].name.value)
                }                
            }
        }
    return response.join([seperator = ','])
  }

function getArgumentsAndBuildQuery(args) {
    const mapping = { startTime: 'sd', endTime: 'ed', symbols: 'ids', exchange: 'exc' }
    wClause = ''
    for (const element in args) {
        if (args[element] != null) {
            wClause = wClause.concat(mapping[element])
            wClause = wClause.concat('=')
            if (Array.isArray(args[element])) {
                wClause = wClause.concat(args[element].join([separator = ',']))
            } else {
                wClause = wClause.concat(args[element])
            }
            wClause = wClause.concat('&')    
        }
    }
    wClause = wClause.slice(0, -1)
    return wClause
}

const typeDefs = gql`
    type Query {
        trade(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Trade!]!
        order(startTime: String, endTime: String, symbols: [String!], exchange: [String!]): [Order!]!
        ethereum_transactions: [EthereumTransaction!]
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

    type BlockData {
        block_num: Int!
        block_hash: String!
        timestamp: Int!
        miner: String!
        parent_hash: String!
        num_transactions: Int!
    }

    type EthereumTransaction {
        block_data: BlockData
        tx_hash: String!
        from: String!
        to: String!
        gas: Int!
        gas_price: Int!
        value: Int!
    }
`;

const resolvers = {
    Query: {
      trade: (_, args, context, info) => {
        filters = getFilters(info)
        wClause = getArgumentsAndBuildQuery(args)
        if (!wClause.length) {
            filters = 'columns='.concat(filters)
        } else {
            filters = '&columns='.concat(filters)
        }
        console.log(`${baseURL}/getData?${wClause}${filters}`)
        return fetch(`${baseURL}/getData?${wClause}${filters}`).then(res => res.json())
      },
      order: (_, args, context, info) => {
        filters = getFilters(info)
        wClause = getArgumentsAndBuildQuery(args)
        if (!wClause.length) {
            filters = 'columns='.concat(filters)
        } else {
            filters = '&columns='.concat(filters)
        }
        console.log(`${baseURL}/getData?tbl=order&${wClause}${filters}`)
        return fetch(`${baseURL}/getData?${wClause}${filters}`).then(res => res.json())
      },
      ethereum_transactions: (_, args, context, info) => {
        filters = getFilters(info)
        wClause = getArgumentsAndBuildQuery(args)
        if (!wClause.length) {
            filters = 'columns='.concat(filters)
        } else {
            filters = '&columns='.concat(filters)
        }
        console.log(`${baseURL}/getData?tbl=ethereum&${wClause}${filters}`)
        return fetch(`${baseURL}/getData?${wClause}${filters}`).then(res => res.json())
      }
    },
  }

const server = new ApolloServer({ typeDefs, resolvers, cache: "bounded", introspection: true });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});