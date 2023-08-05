import mongoose from "mongoose";

const passRecoveryCollection = "passRecoveries"

const passRecoverySchema = new mongoose.Schema({
    email: { type: String, ref: "users" },
    token: { type: String, required: true},
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expireAfterSeconds: 3600 }
})

mongoose.set("strictQuery", false)
const PassRecoveryModel = mongoose.model(passRecoveryCollection, passRecoverySchema)

export default PassRecoveryModel