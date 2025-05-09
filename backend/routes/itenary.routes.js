import express from "express";
import itinaryController from "../controllers/itinary.controllers.js";
import validateSchema from "../middlewares/validate.js";
import itinerarySchema from "../validators/itenary.validator.js";
import auth from "../middlewares/auth.js";

let itineraryRouter = express.Router();

itineraryRouter.post("/", auth, validateSchema(itinerarySchema), itinaryController.travelPlan);

itineraryRouter.get("/", auth, itinaryController.getAllItineraries);

itineraryRouter.get("/autocomplete", itinaryController.getAutocomplete);

itineraryRouter.delete("/:id", auth, itinaryController.deleteItinerary);


export default itineraryRouter;
