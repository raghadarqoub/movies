import mongoose ,{ model, Schema} from "mongoose";
const bookingSchema = new Schema({
movie: {
    type:mongoose.Types.ObjectId,
    ref: "Movies",
    required: true,
},
date:{
    type: Date,
    required: true,
},
seatNumber:{
    type: Number,  
    required: true,
},
user:{
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
}
},{
        timestamps: true,
})
const bookingModel = model("Booking", bookingSchema);

export default bookingModel;