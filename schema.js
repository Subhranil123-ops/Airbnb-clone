const Joi = require("joi");
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        media: Joi.object({
            image: Joi.object({
                filename: Joi.string(),
                url: Joi.string().allow("", null)
            }),
            model: Joi.object({
                filename: Joi.string(),
                url: Joi.string().allow("", null)
            }),
        }),
        category:Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});
const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().trim().required(),
        rating: Joi.number().required().min(1).max(5),
        createdAt: Joi.date().allow("", null)
    }).required()
});
const signSchema = Joi.object({
    sign: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string()
            .required()
            .min(8)
            .pattern(/[0-9]/)
            .pattern(/[!@#$%^&*]/)
    }).required()
})
module.exports = {
    listingSchema,
    reviewSchema,
    signSchema
};