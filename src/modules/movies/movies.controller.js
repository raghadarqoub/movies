// import jwt from 'jsonwebtoken';
// import moviesModel from '../../../db/models/movies.model.js';
// export const addMovie = async (req, res) => {
// const token = req.headers.authorization.split(" ")[1];
// if (!token && token.trim() === "" ) {
//     return res.status(401).json({ message: "token not found" });
// }
// //verify token
// const decoded = jwt.verify(token, process.env.CONFIRM_EMAILTOKEN, (err, decrypted) => {
//     if (err) {
//         return res.status(400).json({ message: ` ${err.message}` });
//     }
//     decoded= decrypted.id;
//     return;
// });
// // create new movie
// const { title, description, actors, releaseDate, posterUrl , featured , bookings } = req.body;
// if ( !title && title.trim() === "" 
// && !description && description.trim() === "" 
// && posterUrl && posterUrl.trim() === "" 
// ) {
//     return res.status(422).json({ message: "invalid inputs " });
// }
// const movie = await moviesModel.create({ title, description, releaseDate:new Date(`${releaseDate}`), featured  , actors,admin:decoded });
// if (!movie) {
//     return res.status(500).json({ message: "movie not created" });
// }
// return res.status(201).json({ message: "movie created", movie });
// }

// import jwt from 'jsonwebtoken';
// import moviesModel from '../../../db/models/movies.model.js';
// export const addMovie = async (req, res) => {
//     try {
//     // 1. Extract and validate token (if authorization header exists)
//     let decoded;
//     if (req.headers.authorization) {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token || token.trim() === '') {
//         return res.status(401).json({ message: 'Token not found' });
//         }
//         try {
//         decoded = jwt.verify(token, process.env.CONFIRM_EMAILTOKEN); // Use .verify for synchronous verification
//         } catch (err) {
//         return res.status(400).json({ message: `${err.message}` });
//         }
//     }
//     // 2. Validate movie data
//     const { title, description, actors = [], releaseDate, posterUrl, featured = false, bookings = [] } = req.body;
//     const requiredFields = ['title', 'description', 'posterUrl', 'releaseDate'];
//     const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');

//     if (missingFields.length > 0) {
//         return res.status(422).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
//     }
//     // 3. Create new movie
//     const movie = await moviesModel.create({
//         title,
//         description,
//         posterUrl,
//         releaseDate: new Date(releaseDate),
//         featured,
//         actors,
//       admin: decoded?.id, // Use optional chaining for safer access
//     }); 
//     const session = await mongoose.startSession();
//     const adminUser =await adminModel.findById(decoded?.id);
//     session.startTransaction();
//     await movie.save({ session });
//     adminUser.movies.push(movie);
//     await adminUser.save({ session });
//     await session.commitTransaction();

//     if (!movie) {
//         return res.status(500).json({ message: 'Movie not created' });
//     }
//     // 4. Send successful response
//     return res.status(201).json({ message: 'Movie created', movie });
//   } catch (error) { // Handle any uncaught errors
//     console.error('Error adding movie:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const getMovies = async (req, res) => {  
//     const movies = await moviesModel.find({}); 
//     if (!movies) {
//         return res.status(404).json({ message: "movies not found" });
//     }
//     return res.status(200).json({ message: "success", movies });
// }
// export const detailsMovies = async (req, res) => {
//     const movie = await moviesModel.findById(req.params.id);
//     if (!movie) {
//         return res.status(404).json({ message: "movie not found" });
//     }
//     return res.status(200).json({ message: "success", movie });
// }

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import moviesModel from '../../../db/models/movies.model.js';
import adminModel from '../../../db/models/admin.model.js';

export const addMovie = async (req, res) => {
    try {
        let decoded;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token || token.trim() === '') {
                return res.status(401).json({ message: 'Token not found' });
            }
            try {
                decoded = jwt.verify(token, process.env.CONFIRM_EMAILTOKEN);
            } catch (err) {
                return res.status(400).json({ message: `${err.message}` });
            }
        } else {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const { title, description, actors = [], releaseDate, posterUrl, featured = false } = req.body;
        const requiredFields = ['title', 'description', 'posterUrl', 'releaseDate'];
        const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');

        if (missingFields.length > 0) {
            return res.status(422).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const movie = new moviesModel({
            title,
            description,
            posterUrl,
            releaseDate: new Date(releaseDate),
            featured,
            actors,
            admin: decoded?.id,
        });

        await movie.save({ session });

        const adminUser = await adminModel.findById(decoded?.id).session(session);
        if (!adminUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Admin user not found' });
        }

        if (!Array.isArray(adminUser.addedMovies)) {
            adminUser.addedMovies = [];
        }

        adminUser.addedMovies.push(movie._id);
        await adminUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: 'Movie created', movie });
    } catch (error) {
        console.error('Error adding movie:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getMovies = async (req, res) => {  
    const movies = await moviesModel.find({}); 
    if (!movies) {
        return res.status(404).json({ message: "movies not found" });
    }
    return res.status(200).json({ message: "success", movies });
}
export const detailsMovies = async (req, res) => {
    const movie = await moviesModel.findById(req.params.id);
    if (!movie) {
        return res.status(404).json({ message: "movie not found" });
    }
    return res.status(200).json({ message: "success", movie });
}