import itineraryService from "../services/itineraryService.js";
import expressAsyncHandler from "express-async-handler";

export const travelPlan = expressAsyncHandler(async (req, res, next) => {
    try {
        let travelPlan = await itineraryService.travelPlan(req);
        res.status(200).json(travelPlan);
    } catch (err) {
        console.log("Error in travelPlan controller", err);
        // res.status(500).json({ message: "Internal Server Error" });
        next(err);
    }
});


export const getAllItinerary = expressAsyncHandler(async (req, res) => {
    try {
        let alltravelPlan = await itineraryService.getAllItinerary(req);
        res.status(200).json(alltravelPlan);
    } catch (err) {
        console.log("Error in getAllItineraries controller", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deleteItinerary = expressAsyncHandler(async (req, res) => {
    try {
        await itineraryService.deleteItinerary(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        console.error("Error in deleteItinerary controller", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export const getAutocomplete = expressAsyncHandler(async (req, res) => {
    // console.log("Autocomplete request received", res);
    // console.log("Autocomplete request received", req.body);
    try {
        let autocompleteResults = await itineraryService.getAutocomplete(req);
        res.status(200).json(autocompleteResults);
    } catch (err) {
        console.error("Error in getAutocomplete controller", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export const getItineraryById = expressAsyncHandler(async (req, res) => {
    let itinerary = await itineraryService.getItineraryById(req.params.id);
    if (!itinerary) {
        res.status(404).json({ message: "No data found" });
        return;
    }
    res.status(200).json(itinerary);
});

export const getMostVisited = expressAsyncHandler(async (req, res) => {
    try {
        console.log("Fetching most visited itineraries in controller");
        let mostVisited = await itineraryService.getMostVisited(req);
        if (!mostVisited) {
            res.status(404).json({ message: "No data found" });
            return;
        } else {
            res.status(200).json(mostVisited);
        }
    } catch (err) {
        console.log("error in getMostVisited controller", err);
        res.status(500).json({ message: "Internal Server Error ❌" });
    }
});