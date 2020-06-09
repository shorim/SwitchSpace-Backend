const Joi = require("@hapi/joi");
const subcategorySchemaValidator = require("./subcategory")

const categorySchemaValidator = Joi.object({
    title: Joi.string().alphanum().required(),
    subcategories: Joi.array().items(subcategorySchemaValidator)
});

module.exports = categorySchemaValidator;