const { gql } = require("apollo-server");
const typeDefs = gql`
  scalar Date
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    createdAt: Date
  }
  type Token {
    token: String
  }

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    createdAt: Date
  }

  type Client {
    id: ID
    name: String
    lastName: String
    company: String
    email: String
    phone: String
    seller: ID
    createdAt: Date
  }

  type Order{
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    seller: ID
    state: StateOrder
    createdAt: Date
  }
  type OrderGroup{
    id:ID
    quantity: Int
  }

  type BestClient{
    total:Float
    client: [Client]
  }

  type BestSeller{
    total:Float
    seller:[User]
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  input ClientInput {
    name: String!
    lastName: String!
    company: String!
    email: String!
    phone: String
  }

  input OrderProductInput{
    id: ID
    quantity: Int
  }

  input OrderInput{
    order:[OrderProductInput]
    total: Float!
    client: ID!
    state: StateOrder!
  }
  input OrderInputUpdate{
    order:[OrderProductInput]
    total: Float
    client: ID!
    state: StateOrder!
  }

  enum StateOrder {
    PENDING,
    CANCELLED,
    COMPLETED
  }

  type Query {
    # User
    getUser: User

    # Product
    getProducts: [Product]
    getProduct(id: ID!): Product

    # Client
    getClients: [Client]
    getClientsSeller: [Client]
    getClient(id: ID!): Client

    # Order
    getOrders: [Order]
    getOrdersSeller: [Order]
    getOrder(id: ID!): Order
    getOrdersByState(state: String!):[Order]
    
    # complex_querys
    getBestClients: [BestClient]
    getBestSellers: [BestSeller]
    getSearchProduct(text: String!): [Product]
  }
  type Mutation {
    # User
    newUser(input: UserInput): User
    loginUser(input: LoginInput): Token

    # Product
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Client
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput):Client
    deleteClient(id: ID!): String

    #Order
    newOrder(input: OrderInput) : Order
    updateOrder(id: ID!, input: OrderInputUpdate): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;
