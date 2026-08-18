const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function createNewTechnician() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    // የምንፈጥረው አዲስ የቴክኒሻን መረጃ
    const email = "tech@dbu.edu.et";
    const password = "123456password";

    // ቀደሞ ካለ ማጥፋት
    await User.deleteOne({ email });

    // አዲስ መፍጠር
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName: "DBU ICT Technician",
      email: email,
      password: hashedPassword,
      role: "technician",
    });

    console.log("\n=======================================");
    console.log("🎉 አዲስ የቴክኒሻን አካውንት በስኬት ተፈጥሯል!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("=======================================\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

createNewTechnician();
