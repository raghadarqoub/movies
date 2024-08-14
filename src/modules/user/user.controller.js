import bookingModel from '../../../db/models/booking.model.js';
import userModel from './../../../db/models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
    const users = await userModel.find({});
    if (!users) {
        return res.status(500).json({ message: "users not found" });
    }
    return res.status(200).json({ message: "success", users });
} 
export const singUp = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }
const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
const user = await userModel.create({ name, email, password:hashedPassword });
const token =jwt.sign({email},process.env.CONFIRM_EMAILTOKEN);
    if (!user) { 
        return res.status(500).json({ message: "user not created" });
    }
    return res.status(200).json({ message: "user created", user,token  });
}
export const login = async (req, res) => {
    const { email,password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(404).json({ message: "password incorrect" });
    }
    return res.status(200).json({ message: "success", user });
}

export const updateUser = async (req, res) => {
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
        const user = await userModel.findByIdAndUpdate(req.params.id, { name, email, password:hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({ message: "user updated", user });
}
export const deleteUser = async (req, res) => { 
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    return res.status(404).json({ message: "user deleted" });
}

export const getBookingOfUser = async (req, res) => {
    const id = req.params.id;
    const bookings = await bookingModel.find({ user: id });
    if (!bookings) {
        return res.status(404).json({ message: "bookings not found" });
    }
    return res.status(200).json({ message: "success", bookings });
}