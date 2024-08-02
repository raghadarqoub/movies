import { Router } from "express";
import express from 'express';
// import { addMovie, getMovies, detailsMovies } from './movies.controller.js';
import * as moviesController from "./movies.controller.js";

const router = Router();
router.post('/movie',moviesController.addMovie);
router.get('/getMovies',moviesController.getMovies);
router.get('/:id',moviesController.detailsMovies);
export default router;