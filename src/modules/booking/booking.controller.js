
import mongoose from 'mongoose';
import bookingModel from "../../../db/models/booking.model.js";
import moviesModel from "../../../db/models/movies.model.js";
import userModel from "../../../db/models/user.model.js";

export const addBooking = async (req, res) => {
    const { movie, date, seatNumber, user } = req.body;

    const existingMovie = await moviesModel.findById(movie);
    const existingUser = await userModel.findById(user);

    if (!existingMovie) {
        return res.status(404).json({ message: "movie not found" });
    }
    if (!existingUser) {
        return res.status(404).json({ message: "user not found" });
    }

    const booking = await bookingModel.create({ movie, date: new Date(`${date}`), seatNumber, user });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.bookings.push(booking._id); 
    existingMovie.bookings.push(booking._id); 

    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    await session.commitTransaction();

    if (!booking) {
        return res.status(500).json({ message: "booking not created" });
    }

    return res.status(201).json({ message: "booking created", booking });
}

export const getBookingById = async (req, res) => {
    const id = req.params.id;
    const bookings = await bookingModel.findById( id);
    if (!bookings) {
        return res.status(500).json({ message: "bookings not found" });
    }  

    return res.status(200).json({ message: "success", bookings });
}

export const removeBooking  = async (req, res) => {
    const id = req.params.id; 
    const booking = await bookingModel.findByIdAndDelete(id);
    if (!booking) {
        return res.status(404).json({ message: "booking not found" });
    }
    return res.status(200).json({ message: "booking deleted", booking });
}