const {ApolloServer} = require('apollo-server');
const conectDB = require('./config/db');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');


//conecting DB
conectDB();
//server
const server = new ApolloServer(
    {
    typeDefs,
    resolvers
}
);


//boot the server
server.listen().then( ({url}) =>{
    console.log(`Server ready at the url ${url}`);
});