import mongoose ,{ model, Schema} from "mongoose";
const adminSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    addedMovies:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Movies"
        }
    ]

},{
        timestamps: true,
})
const adminModel = model("Admin", adminSchema);

export default adminModel;