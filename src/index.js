const { ApolloServer } = require("apollo-server");
const conectDB = require("./config/db");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({ path: "variables.env" });

//conecting DB
conectDB();
//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers['authorization']);
    let token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ',''), process.env.SECRET);
        // console.log(user);
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

//boot the server
server.listen().then(({ url }) => {
  console.log(`Server ready at the url ${url}`);
});
