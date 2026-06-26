const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {isLoggedIn, saveRedirectUrl, isReviewAuthor , isOwner} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

const ownerController = require("../controllers/owners.js");

//Owner 
router.get("/", isOwner ,ownerController.owner);

//Dashboard
router.get(
    "/dashboard",
    isLoggedIn,
    isOwner,
    ownerController.dashboard
);

//Create new Turf
router.get('/new'  , ownerController.createTurf);

//Post new Turf
router.post(
    "/turfs",
    isLoggedIn,
    isOwner,
    upload.single("turf[image]"),
    ownerController.postNewTurf
);

//Edit turf
router.get("/:id/edit" , ownerController.editTurf)

//Post Edit Turf
router.post("/:id" , isLoggedIn,
    isOwner,
    upload.single("turf[image]"),
    ownerController.postEditTurf)

//Turf delete
router.get('/:id/delete' , ownerController.destroyTurf)

//Get booking Information
router.get(
    "/bookings",
    isLoggedIn,
    isOwner,
    ownerController.getBookingDetails
);


module.exports = router;
