import Joi from "joi";

export const singUp =Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/ ).required(),
})

export const login =Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[A-Z][a-z0-9]{3,20}$/ ).required(),
})