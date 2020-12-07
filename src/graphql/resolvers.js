import User from "../models/User";
import Product from "../models/Product";
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
    getUser: (_, { token }) => {
      const userId = jwt.verify(token, process.env.SECRET);

      return userId;
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
  },
};

module.exports = resolvers;
