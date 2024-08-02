
import adminModel from '../../../db/models/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const addAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({email});
    if(admin){
        return res.status(400).json({ message: "Admin already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
    const newAdmin = await adminModel.create({ email, password:hashedPassword });
    if (!newAdmin) {
        return res.status(500).json({ message: "Admin not created" });
    }
    return res.status(201).json({ message: "Admin created", admin: newAdmin });

}


export const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    if (!bcrypt.compareSync(password, admin.password)) {
        return res.status(404).json({ message: "password incorrect" });
    }
    const token =jwt.sign({id:admin._id},process.env.CONFIRM_EMAILTOKEN,{expiresIn:'7d'});
    return res.status(200).json({ message: "success",token,id:admin._id, admin });
}

export const getAllAdmins = async (req, res) => {
    const admins = await adminModel.find({});
    if (!admins) {
        return res.status(404).json({ message: "Admins not found" });
    }
    return res.status(200).json({ message: "success", admins });
}