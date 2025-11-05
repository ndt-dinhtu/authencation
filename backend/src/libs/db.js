import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("Ket noi CSLD thanh cong");
  } catch (error) {
    console.log("Ket noi CSDL that bai");
    process.exit(1);
  }
};
