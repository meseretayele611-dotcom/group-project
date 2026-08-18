const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // ⚠️ በ .env ፋይልሽ ውስጥ MONGO_URI ካለ እሱን ያነባል፡ ካልሆነ ቀጥታ የ Cloud Atlas Link ይጠቀማል
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.xxxx.mongodb.net/dbu_maintenance?retryWrites=true&w=majority";

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
