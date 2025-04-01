import mongooose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    channel: {
        type: Schema.Types.ObjectId,// one whom'subscriber' is subscribing
        ref: "User" 
    }
},{timestamps: true})

export const Subscription = mongooose.model("Subscription", subscriptionSchema)