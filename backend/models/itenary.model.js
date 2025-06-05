import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    travelType: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 5000;
            },
            message: "Budget must be a positive number"
        }
    },
    itinerary: {
        type: Object,
        required: true
    }
}, { timestamps: true })


itinerarySchema.pre('save', function (next) {
    const currentDate = new Date();
    if (this.startDate <= currentDate) {
        const err = new Error('Start date must be in the future');
        next(err);
    }
    next();
});


const Itinerary = mongoose.model("Itinerary", itinerarySchema);



export default Itinerary;