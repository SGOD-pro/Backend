import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        const mongooseInstance = await mongoose.connect('mongodb://localhost:27017/ChaiandBackend')
        console.log(`Mongodb Connected ${mongooseInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB error: ",error);
        throw error
    }
}
export default ConnectDB