const express = require("express");
const router = express.Router();

// DB
const mongoose = require("mongoose");

// Importing User Schema 
const User = require("../models/User.model");

// Importing Outfits Schema
const Outfit = require("../models/Outfit.model");

// Importing Piece Schema
const Piece = require("../models/Piece.model");

// Route access
const isLoggedIn = require("../middleware/isLoggedIn");

// logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("private/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

// profile
router.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.currentUser

  User.findById(user._id).then(async(userDb)=>{

  await userDb.populate("collections");
  
  let collectionsObj = [];

  for(let i = 0; i < userDb.collections.length; i++){
    Promise.all(
        [
          Piece.findById(userDb.collections[i]._id),
          Piece.findById(userDb.collections[i].top),
          Piece.findById(userDb.collections[i].bottom),
          Piece.findById(userDb.collections[i].shoes),
        ]
      ).then((vals) => {
        collectionsObj.push({id:vals[0], top:vals[1], bottom:vals[2], shoes:vals[3]});
        res.render("private/profile",{user: userDb, collection: collectionsObj});
    })
  } 
  }).catch((err) => {
    console.error(err);
  })
})

// edit outfit
router.get("/outfit/:outfitId/preview", (req,res) => {
  let {outfitId} = req.params;
  res.render("private/preview")
})  

module.exports = router;
