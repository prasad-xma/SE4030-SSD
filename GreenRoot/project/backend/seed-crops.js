const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

const Product = require("./seller/model/productModel");
const Crop = require("./farmer/model/cropModel");
const Category = require("./farmer/model/categoryModel");
const Field = require("./farmer/model/fieldModel");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.mongoURL);
    console.log("Connected to MongoDB successfully.");

    // Find seller and farmer users
    const seller = await mongoose.connection.db.collection("users").findOne({ role: "seller" });
    const farmer = await mongoose.connection.db.collection("users").findOne({ role: "farmer" });

    if (!seller) {
      throw new Error("No user with role 'seller' found in database.");
    }
    console.log(`Found seller: ${seller.firstName} ${seller.lastName} (${seller._id})`);

    const sellerId = seller._id;
    const farmerId = farmer ? farmer._id.toString() : "6ab9041346ec72f192fc9c85";

    // 1. Ensure categories exist in categorymodels
    let fruitCat = await Category.findOne({ name: "Fruits" });
    if (!fruitCat) {
      fruitCat = await Category.create({ name: "Fruits", image: "/customer_images/fruits.jpg" });
    }
    let vegCat = await Category.findOne({ name: "Vegetables" });
    if (!vegCat) {
      vegCat = await Category.create({ name: "Vegetables", image: "/customer_images/vegetables.webp" });
    }
    let grainCat = await Category.findOne({ name: "Grains" });
    if (!grainCat) {
      grainCat = await Category.create({ name: "Grains", image: "/customer_images/grains.jpg" });
    }
    console.log("Categories ensured:", fruitCat.name, vegCat.name, grainCat.name);

    // 2. Ensure field exists in fieldmodels
    let sampleField = await Field.findOne({ farmerID: farmerId });
    if (!sampleField) {
      sampleField = await Field.create({
        xcordinate: 6.9271,
        ycordinate: 79.8612,
        city: "Kandy",
        farmerID: farmerId,
      });
      console.log("Sample field created:", sampleField._id);
    }

    // 3. Add products to productmodels (for Customer store)
    const productItems = [
      // Vegetables
      {
        name: "Organic Red Tomatoes",
        quantity: 100,
        fertilizer: "Organic Compost",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
        category: "Vegetables",
        supplier: "GreenRoot Agro",
        sellerId: sellerId,
        price: 150,
      },
      {
        name: "Fresh Crisp Carrots",
        quantity: 80,
        fertilizer: "Natural Vermicompost",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
        category: "Vegetables",
        supplier: "Nuwara Eliya Greens",
        sellerId: sellerId,
        price: 180,
      },
      {
        name: "Farm Fresh Potatoes",
        quantity: 120,
        fertilizer: "Organic Manure",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
        category: "Vegetables",
        supplier: "Highland Valley Farms",
        sellerId: sellerId,
        price: 200,
      },
      {
        name: "Crisp Green Cabbage",
        quantity: 60,
        fertilizer: "Bio-fertilizer",
        image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=600&q=80",
        category: "Vegetables",
        supplier: "GreenRoot Agro",
        sellerId: sellerId,
        price: 160,
      },
      // Fruits
      {
        name: "Fresh Red Apples",
        quantity: 75,
        fertilizer: "Organic Potash",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        category: "Fruits",
        supplier: "Sun Valley Orchards",
        sellerId: sellerId,
        price: 350,
      },
      {
        name: "Cavendish Bananas",
        quantity: 150,
        fertilizer: "Organic Compost",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        category: "Fruits",
        supplier: "Tropical Harvest",
        sellerId: sellerId,
        price: 140,
      },
      {
        name: "Juicy Sweet Watermelon",
        quantity: 40,
        fertilizer: "Natural Manure",
        image: "/customer_images/melon.jpg",
        category: "Fruits",
        supplier: "Sun Harvest",
        sellerId: sellerId,
        price: 280,
      },
      // Grains
      {
        name: "Premium Basmati Rice",
        quantity: 50,
        fertilizer: "Organic Urea",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        category: "Grains",
        supplier: "Golden Grain Mills",
        sellerId: sellerId,
        price: 450,
      },
      {
        name: "Whole Wheat Grain",
        quantity: 90,
        fertilizer: "Natural Bio-fertilizer",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
        category: "Grains",
        supplier: "Highland Agro Grains",
        sellerId: sellerId,
        price: 320,
      },
      {
        name: "Organic Rolled Oats",
        quantity: 65,
        fertilizer: "Organic Compost",
        image: "https://images.unsplash.com/photo-1614961908595-6e4b4491ba68?auto=format&fit=crop&w=600&q=80",
        category: "Grains",
        supplier: "Harvest Agro Mills",
        sellerId: sellerId,
        price: 390,
      },
    ];

    for (const item of productItems) {
      const existing = await Product.findOne({ name: item.name });
      if (!existing) {
        const created = await Product.create(item);
        console.log(`Created product: ${created.name} (${created.category}) - Rs.${created.price}`);
      } else {
        console.log(`Product already exists: ${item.name}`);
      }
    }

    // 4. Add corresponding crops to cropmodels (for Farmer/RetailSeller views)
    const cropItems = [
      {
        name: "Carrot",
        quantity: 80,
        fertilizer: "Natural Vermicompost",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
        categoryID: vegCat._id.toString(),
        farmerID: farmerId,
        fieldID: sampleField._id.toString(),
        overview: "Fresh organic carrots harvested from highland soil.",
        price: 160,
        status: "onfield",
      },
      {
        name: "Apple",
        quantity: 60,
        fertilizer: "Organic Potash",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        categoryID: fruitCat._id.toString(),
        farmerID: farmerId,
        fieldID: sampleField._id.toString(),
        overview: "Crisp red apples grown without synthetic pesticides.",
        price: 320,
        status: "onfield",
      },
      {
        name: "Basmati Rice",
        quantity: 50,
        fertilizer: "Organic Urea",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        categoryID: grainCat._id.toString(),
        farmerID: farmerId,
        fieldID: sampleField._id.toString(),
        overview: "Aromatic long grain basmati paddy harvested sustainably.",
        price: 400,
        status: "onfield",
      },
      {
        name: "Banana",
        quantity: 120,
        fertilizer: "Organic Compost",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        categoryID: fruitCat._id.toString(),
        farmerID: farmerId,
        fieldID: sampleField._id.toString(),
        overview: "Naturally ripened sweet Cavendish bananas.",
        price: 120,
        status: "onfield",
      },
    ];

    for (const crop of cropItems) {
      const existingCrop = await Crop.findOne({ name: crop.name });
      if (!existingCrop) {
        const createdCrop = await Crop.create(crop);
        console.log(`Created crop: ${createdCrop.name} - Rs.${createdCrop.price}`);
      } else {
        console.log(`Crop already exists: ${crop.name}`);
      }
    }

    console.log("Seeding completed successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
