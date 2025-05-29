import itineraryModel from '../models/itenary.model.js';
import userModel from '../models/user.model.js';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";


class ItineraryService {


    async travelPlan(req) {
        try {
            const { travelType, location, startDate, endDate, budget } = req.body;
            
            let user = await userModel.findById(req.userId);

            if (!user.isSubscribed && user.itenaryCount >= 2) {
                let err = new Error("You have reached the limit of 2 itineraries. Please subscribe to create more itineraries.");
                err.statusCode = 403;
                throw err;
            }

            const client = new GoogleGenAI({
                apiKey: process.env.GEMINI_APIKEY,
            })

            const response = await client.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Create a travel itinerary for travel type ${travelType} for the location ${location} from date ${startDate} to date ${endDate}, and budget of $${budget}. Return JSON in the following format:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "plan": ["activity/place 1", "activity/place 2"],           
      "cost": 0,
      "tip": "daily tip about travel, food, or local culture"
    }
  ],
  "total": {
    "stay": 0,
    "food": 0,
    "travel": 0
  },
  "tips": [
    "general tip 1",
    "general tip 2"
  ],
}
Guidelines:
- In 'plan', always include at least 2-3 must-visit famous places or activities of the region, and ensure the customer visits at least one must-visit place or activity in 2 to 3 of the plans.
- In 'food', for each meal (breakfast, lunch, dinner), suggest a hotel/restaurant name (or 'Street Food' if budget is low) and must-try dishes, focusing on famous food, sweets, and beverages of the region for all budgets.
- In 'guidelines', provide exactly 3 points, only if they are important for that state/city/town/country, about what NOT to do: e.g., General Travel Etiquette, City-Specific Behavior, Environmental Responsibility, Legal & Cultural Sensitivities, Religious and Cultural Site rules, or Local Laws to Highlight. Do not include more than 3 points, and only mention if truly important for the location.`,
            })




            if (!response || !response.text) {
                let err = new Error("No response from Google GenAI");
                err.statusCode = 500;
                throw err;
            }

            let content = response.text;
            content = content
                .replace(/```json\n/g, "")
                .replace(/```/g, "")
                .trim();

            const jsonData = content ? JSON.parse(content) : null;

            let payload = req.body;
            payload.itinerary = jsonData;
            if (req.userId) {
                payload.userId = req.userId;
            }
            await this.saveItinerary(payload);
            // user.itenaryCount = user.itenaryCount + 1;
            // await user.save();
            await userModel.findByIdAndUpdate(req.userId, { $inc: { itenaryCount: 1 } });
            return { message: "Success", data: jsonData };

        } catch (error) {
            throw error;
        }

    }

    async saveItinerary(payload) {
        let newTravelPlan = await itineraryModel.create(payload);
        if (newTravelPlan) {
            // console.log("Travel Plan is saved ", newTravelPlan);
            return "saved";
        } else {
            let error = new Error("Unable to save itinerary");
            error.statusCode = 400;
            throw error;
        }
    }

    async getAllItinerary(req) {
        let alltravelPlan = await itineraryModel.find({ userId: req.userId })
        // .populate("userId", "name email displayPicture");
        // console.log(alltravelPlan);
        if (alltravelPlan) {
            return alltravelPlan;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }
    async deleteItinerary(id) {
        let deletedTravelPlan = await itineraryModel.findByIdAndDelete(id);
        if (deletedTravelPlan) {
            return deletedTravelPlan;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }

    async getAutocomplete(req) {
        try {
            const { location } = req.query;
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                params: {
                    input: location,
                    key: process.env.MAP_API,
                },
            });
            return response.data.predictions.map((prediction) => prediction.description);
        } catch (error) {
            console.error("Error fetching places:", error);
            throw error;
        }
    }

    async getItineraryById(id) {
        let travelPlan = await itineraryModel.findById(id);
        if (travelPlan) {
            return travelPlan;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }

}

export default new ItineraryService();