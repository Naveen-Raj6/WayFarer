import express from 'express';
import {
    travelPlan,
    getAllItinerary,
    deleteItinerary,
    getAutocomplete,
    getItineraryById
} from '../controllers/itinary.controllers.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, travelPlan);
router.get('/', auth, getAllItinerary);
router.delete('/:id', auth, deleteItinerary);
router.get('/autocomplete', auth, getAutocomplete);
router.get('/:id', auth, getItineraryById);

export default router;