const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, saveRedirectUrl, isReviewAuthor} = require("../middleware.js");


const turfController = require("../controllers/turfs.js");
//Index Route
router.get('/' , wrapAsync(turfController.index));

// My bookings show route
router.get("/bookings", isLoggedIn, turfController.showBooking);

//Booking Cancel route
router.put("/bookings/:bookingId/cancel", isLoggedIn, turfController.destroyBooking);

//Show Route
router.get('/:id' , wrapAsync(turfController.show));

//GET slots
router.get('/:id/slots' , turfController.fetchSlot);

//Slot Book
router.post("/:id/book",  isLoggedIn, turfController.bookSlot);

//Delete Booking
router.delete("/bookings/:id", turfController.destroyBooking);

module.exports = router;