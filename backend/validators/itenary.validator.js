import Joi from "joi"

const itinerarySchema = Joi.object({
    travelType: Joi.string().required(),
    budget: Joi.number().min(0),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    location: Joi.string().required(),
})

export default itinerarySchema;