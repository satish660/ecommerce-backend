import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 CONNECT MONGODB */
mongoose.connect("mongodb://admin:1234@ac-ixwg30q-shard-00-00.iujqcqw.mongodb.net:27017,ac-ixwg30q-shard-00-01.iujqcqw.mongodb.net:27017,ac-ixwg30q-shard-00-02.iujqcqw.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-xyfg24-shard-0&authSource=admin&retryWrites=true&w=majority")  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

/* 🏠 TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* 📦 GET ALL PRODUCTS */
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📦 GET SINGLE PRODUCT */
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/add-test", async (req, res) => {
  const products = [
    {
      title: "iPhone 15",
      price: 70000,
      image: "https://via.placeholder.com/150"
    },
    {
      title: "Laptop",
      price: 50000,
      image: "https://via.placeholder.com/150"
    },
    {
      title: "Headphones",
      price: 2000,
      image: "https://via.placeholder.com/150"
    }
  ];

  await Product.insertMany(products);
  res.send("Test products added ✅");
});

/* ➕ ADD PRODUCT */
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send("Product added ✅");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send("Product updated ✅");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🚀 START SERVER */
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});