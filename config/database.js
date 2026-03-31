const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb://arpitj6_db_user:Atu0AwlR7MMDickG@ac-ay23zuc-shard-00-00.povqxbf.mongodb.net:27017,ac-ay23zuc-shard-00-01.povqxbf.mongodb.net:27017,ac-ay23zuc-shard-00-02.povqxbf.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-dszw16-shard-0&authSource=admin&appName=namastedev",
  );
};

module.exports = connectDB;
