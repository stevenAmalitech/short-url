const { nanoid } = require("nanoid");
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: nanoid(10),
  },
});

const urlModel = mongoose.model("Url", urlSchema);

async function connectDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/short_url", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = { connectDb, urlModel };
