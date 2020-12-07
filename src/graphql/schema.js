const {gql} = require('apollo-server');
const typeDefs = gql`
scalar Date
    type User{
        id:ID
        name:String
        lastName:String
        email:String
        createdAt: Date
    }
    type Token{
        token:String
    }

    type Product{
        id:ID
        name:String
        stock:Int
        price:Float
        createdAt: Date
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input LoginInput{
        email:String!
        password:String!
    }
    input ProductInput{
        name:String!
        stock:Int!
        price:Float!
    }

    type Query{
        # User
        getUser(token: String!) : User

        # Product
        getProducts: [Product]
        getProduct(id: ID!): Product
    }
    type Mutation {
        # User
        newUser(input: UserInput): User
        loginUser(input: LoginInput) : Token

        # Product
        newProduct(input: ProductInput) : Product
        updateProduct(id: ID!, input: ProductInput) : Product
        deleteProduct(id: ID!): String
    }
`;

module.exports = typeDefs;