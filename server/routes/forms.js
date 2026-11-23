const express = require("express");

const {
  contactForm,
  accommodationForm,
  restaurantForm,
} = require("../controllers/formController");

const router = express.Router();

router.post("/contact", contactForm);

router.post("/book-accommodation", accommodationForm);

router.post("/book-restaurant", restaurantForm);

module.exports = router;
