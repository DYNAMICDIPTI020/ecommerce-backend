const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const newProducts = [
  {
    name: "Premium Leather Jacket",
    slug: "premium-leather-jacket",
    description: "Genuine leather jacket with modern cut and premium finish",
    price: 299.99,
    categories: ["Outerwear", "Leather"],
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5", alt: "Leather Jacket" }],
    stock: 25,
    sku: "LJ-001",
    brand: "StyleCraft",
    tags: ["leather", "jacket", "premium", "winter"]
  },
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 149.99,
    categories: ["Electronics", "Audio"],
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", alt: "Headphones" }],
    stock: 50,
    sku: "WH-001",
    brand: "AudioTech",
    tags: ["wireless", "bluetooth", "headphones", "audio"]
  },
  {
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    description: "Soft organic cotton t-shirt in various colors",
    price: 29.99,
    categories: ["Clothing", "T-Shirts"],
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", alt: "T-Shirt" }],
    stock: 100,
    sku: "TS-001",
    brand: "EcoWear",
    tags: ["organic", "cotton", "tshirt", "sustainable"]
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description: "Advanced fitness tracking with heart rate monitor",
    price: 199.99,
    categories: ["Electronics", "Fitness"],
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", alt: "Smart Watch" }],
    stock: 30,
    sku: "SW-001",
    brand: "FitTech",
    tags: ["smartwatch", "fitness", "health", "technology"]
  },
  {
    name: "Minimalist Backpack",
    slug: "minimalist-backpack",
    description: "Clean design backpack perfect for work and travel",
    price: 79.99,
    categories: ["Bags", "Accessories"],
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", alt: "Backpack" }],
    stock: 40,
    sku: "BP-001",
    brand: "UrbanCarry",
    tags: ["backpack", "minimalist", "travel", "work"]
  }
];

async function addProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const productData of newProducts) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      if (!existingProduct) {
        await Product.create(productData);
        console.log(`Added: ${productData.name}`);
      } else {
        console.log(`Skipped (exists): ${productData.name}`);
      }
    }

    console.log('Product import completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addProducts();