import User from "../models/User";
import Product from "../models/Product";
import Client from "../models/Client";
import Order from "../models/Order";

import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  const { id, name, lastName, email } = user;
  return jwt.sign({ id, name, lastName, email }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getUser: (_, {}, ctx) => {
      // const userId = jwt.verify(token, process.env.SECRET);
      // return userId;
      return ctx.user;
    },

    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },

    getProduct: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("product not found");
      }
      return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientsSeller: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ seller: ctx.user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const existClient = await Client.findById(id);
      if (!existClient) {
        throw new Error("client not found");
      }
      if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }
      return existClient;
    },

    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersSeller: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ seller: ctx.user.id }).populate('client');
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      const existOrder = await Order.findById(id);
      if (!existOrder) {
        throw new Error("Order not found");
      }
      if (existOrder.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }
      return existOrder;
    },
    getOrdersByState: async (_, { state }, ctx) => {
      const orders = await Order.find({ seller: ctx.user.id, state });
      return orders;
    },

    getBestClients: async () => {
      const clients = await Order.aggregate([
        { $match: { state: "COMPLETED" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $limit: 10,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return clients;
    },
    getBestSellers: async () => {
      const sellers = await Order.aggregate([
        { $match: { state: "COMPLETED" } },
        {
          $group: {
            _id: "$seller",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "seller",
          },
        },
        {
          $limit: 2,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return sellers;
    },
    getSearchProduct: async (_, { text }) => {
      const products = await Product.find({ $text: { $search: text } }).limit(
        10
      );
      return products;
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;
      //checking user exist
      const existUser = await User.findOne({ email });
      if (existUser) {
        throw new Error("The email already exist");
      }
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);
      try {
        //save new user
        const newUser = new User(input);
        await newUser.save();
        return newUser;
      } catch (error) {
        console.log(error);
      }
    },
    loginUser: async (_, { input }) => {
      const { email, password } = input;
      //checking user exist
      const existUser = await User.findOne({ email });
      if (!existUser) {
        throw new Error("The email not exist");
      }
      const existPassword = await bcryptjs.compare(
        password,
        existUser.password
      );
      if (!existPassword) {
        throw new Error("The password not match");
      }
      return {
        token: createToken(existUser, process.env.SECRET, "10h"),
      };
    },
    newProduct: async (_, { input }) => {
      try {
        const newProduct = await new Product(input);
        const response = await newProduct.save();

        return response;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("product not found");
      }
      try {
        product = await Product.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, { id }) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("product not found");
      }
      try {
        await Product.findOneAndDelete({ _id: id });
        return "Product deleted successfully";
      } catch (error) {
        console.log(error);
      }
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      const existClient = await Client.findOne({ email });
      if (existClient) {
        throw new Error("Client already exist");
      }
      const newClient = new Client(input);
      newClient.seller = ctx.user.id;
      try {
        const response = await newClient.save();
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      let existClient = await Client.findById(id);
      if (!existClient) {
        throw new Error("client not found");
      }
      if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }
      existClient = await Client.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return existClient;
    },

    deleteClient: async (_, { id }, ctx) => {
      let existClient = await Client.findById(id);
      if (!existClient) {
        throw new Error("client not found");
      }
      if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }
      await Client.findOneAndDelete({ _id: id });
      return "Client delete successfully";
    },
    newOrder: async (_, { input }, ctx) => {
      // validated client existed
      const { client } = input;
      let existClient = await Client.findById(client);
      if (!existClient) {
        throw new Error("client not found");
      }
      // validate user
      if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }

      // checking stock available
      for await (const item of input.order) {
        const { id } = item;
        const product = await Product.findById(id);
        if (item.quantity > product.stock) {
          throw new Error(
            `The product ${product.name} exceeds the quantity available`
          );
        } else {
          // update stoke
          product.stock = product.stock - item.quantity;
          await product.save();
        }
      }

      // create new order
      let newOrder = new Order(input);
      // assign selesman
      newOrder.seller = ctx.user.id;
      newOrder.state = "PENDING";
      //save DB
      const response = await newOrder.save();
      return response;
    },
    updateOrder: async (_, { id, input }, ctx) => {
      const { client } = input;
      // validated order existed
      const existOrder = await Order.findById(id);
      if (!existOrder) {
        throw new Error("Order not found");
      }
      // validated client existed
      let existClient = await Client.findById(client);
      if (!existClient) {
        throw new Error("client not found");
      }
      // validate user
      if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }

      if (input.order) {
        // checking stock available
        for await (const item of input.order) {
          const { id } = item;
          const product = await Product.findById(id);
          if (item.quantity > product.stock) {
            throw new Error(
              `The product ${product.name} exceeds the quantity available`
            );
          } else {
            // update stoke
            product.stock = product.stock - item.quantity;
            await product.save();
          }
        }
      }
      const response = await Order.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return response;
    },
    deleteOrder: async (_, { id }, ctx) => {
      let existOrder = await Order.findById(id);
      if (!existOrder) {
        throw new Error("Order not found");
      }
      if (existOrder.seller.toString() !== ctx.user.id) {
        throw new Error("client not Authorized");
      }
      await Order.findOneAndDelete({ _id: id });
      return "Order delete successfully";
    },
  },
};

module.exports = resolvers;
