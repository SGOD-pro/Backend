import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        const mongooseInstance = await mongoose.connect('mongodb://localhost:27017/ChaiandBankend')
        console.log(`Mongodb Connected ${mongooseInstance.connection.host}`);
    } catch (error) {
        console.error(error);
        throw error
    }
}
export default ConnectDB