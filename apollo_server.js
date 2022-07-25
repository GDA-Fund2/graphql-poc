import { ApolloServer } from 'apollo-server-express';
import { createServer, ServerResponse } from 'http';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import RedisSubscriber from './redis_subscriber.js';
import {PubSub} from "graphql-subscriptions";

const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

import topics from './topics.js';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/health', (req, res) => {
    res.send('OK');
})

app.get('/ready', (req, res) => {
    res.send('OK');
})

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/'
})

const serverCleanup = useServer({ schema }, wsServer);

for (const exchange of topics.exchanges) {
  for (const feed of topics.feeds) {
    const redisSubscriber = new RedisSubscriber(exchange, feed, pubsub);
    redisSubscriber.run();
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: ({req, res}) => {return {req, res, pubsub}},
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup().dispose();
          }
        }
      }
    }
  ]
});

await server.start();
server.applyMiddleware({ app, path: '/' });

const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

export default pubsub;