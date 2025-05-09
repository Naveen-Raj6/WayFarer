import itineraryService from "../services/itineraryService.js";

class ItineraryController {
    async geminiTravelPlan(req, res, next) {
        try {
            let travelPlan = await itineraryService.geminiTravelPlan(req);
            res.status(200).json(travelPlan);
        } catch (err) {
            console.log("Error in geminiTravelPlan controller", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    async travelPlan(req, res, next) {
        try {
            let travelPlan = await itineraryService.travelPlan(req);
            res.status(200).json(travelPlan);
        } catch (err) {
            console.log("Error in travelPlan controller", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    async getAllItineraries(req, res, next) {
        try {
            let alltravelPlan = await itineraryService.getAllItinerary();
            res.status(200).json(alltravelPlan);
        } catch (err) {
            console.log("Error in getAllItineraries controller", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteItinerary(req, res, next) {
        try {
            await itineraryService.deleteItinerary(req.params.id);
            res.sendStatus(204);
        } catch (err) {
            console.error("Error in deleteItinerary controller", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getAutocomplete(req, res, next) {
        console.log("Autocomplete request received", res);
        console.log("Autocomplete request received", req.body);
        try {
            let autocompleteResults = await itineraryService.getAutocomplete(req);
            res.status(200).json(autocompleteResults);
        } catch (err) {
            console.error("Error in getAutocomplete controller", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

export default new ItineraryController();