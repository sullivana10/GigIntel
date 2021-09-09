const Joi = require('joi');

module.exports.venueSchema = Joi.object({
    venue: Joi.object({
        price: Joi.number().required().min(0),
        title: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})