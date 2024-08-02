import mongoose ,{ model, Schema} from "mongoose";
const moviesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    actors:[{
        type: String,
        required: true,
    }],
    releaseDate: {
        type: Date,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    featured:{
        type: Boolean,
    },
    bookings:[{
        type: mongoose.Types.ObjectId, 
        ref: "Booking"
    }],
    admin:{
        type:mongoose.Types.ObjectId,
        ref: "Admin",
    }
},{
        timestamps: true,
})
const moviesModel = model("Movies", moviesSchema);

export default moviesModel;