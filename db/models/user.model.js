import mongoose ,{ model, Schema} from "mongoose";
const userSchema = new Schema({
    name: {
        type:String,
        required: true,
        minlength:4,
        maxlength:20,
    },
    email: {
        type: String,
        unique: true
        
    },
    password: {
        type: String,
        required: true,
    },
    bookings:[{
        type: mongoose.Types.ObjectId,
        ref: "Booking",
    }],  
},
    {
        timestamps: true,
})
const userModel = model("User", userSchema);

export default userModel;