import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log('MongoDB Connected');

    }catch(error){
        console.log("error occred",error);
    }
}

export default connectDB;