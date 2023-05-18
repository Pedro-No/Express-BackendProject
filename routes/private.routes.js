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

  const user = req.session.currentUser;

  User.findById(user._id).then(async(userDb)=>{
    if(userDb.collections.length >= 1){
      await userDb.populate("collections");

      let collectionsObj = [];
      for(let i = 0; i < userDb.collections.length; i++){
        Promise.all(
            [
              Piece.findById(userDb.collections[i].top),
              Piece.findById(userDb.collections[i].bottom),
              Piece.findById(userDb.collections[i].shoes),
            ]
          ).then((vals) => {
            collectionsObj.push({id: userDb.collections[i]._id, top:vals[0], bottom:vals[1], shoes:vals[2]});
          })
        } 
        res.render("private/profile",{user: userDb, collection: collectionsObj});
    }else {
      res.render("private/profile",{user: userDb, collection:[]})
    }
  }).catch((err) => {
    console.error(err);
  })
})

// preview outfit 
router.get("/outfit/:outfitId/preview", isLoggedIn, (req,res) => {

  let {outfitId} = req.params;

  Outfit.findById(outfitId).then(async(outfitDb) =>{
    
    await outfitDb.populate("top");
    await outfitDb.populate("bottom");
    await outfitDb.populate("shoes");

    res.render("private/preview-outfit", {outfit: outfitDb});
    
  }).catch((err) => {
    console.error(err);
  })
})

// delete outfit
router.post('/outfit/:outfitId/delete', isLoggedIn, async (req, res) => {
  let {outfitId} = req.params;

  const user = req.session.currentUser;

  let collectionsObj = [];
  
  try {
    const userDb = await User.findById(user._id)
    for (let i = 0; i < userDb.collections.length; i++){
      if (userDb.collections[i].toString() !== outfitId) {
        collectionsObj.push(userDb.collections[i])
      }
    }

    userDb.collections=collectionsObj

    await User.findByIdAndUpdate(user._id,userDb,{new:true})
    
  }
  catch (err) {
    console.error(err)
  }

  res.redirect('/profile');
});

// search
router.get('/outfit/search', async (req,res) => {
    const piecesArray = await Piece.find();
    res.render("private/search", {response: piecesArray})
})

router.post('/results', async (req,res) => {
  const {search} = req.body

  try{
    let pieceDb = await Piece.find({name: search});

    let outfitSearch = {};
    
    let typeString = pieceDb[0].pieceType;

    outfitSearch[typeString]=pieceDb[0]._id

    const outfitsDb = await Outfit.find(outfitSearch)

    let outfitsArr =  []

    for(let i = 0; i < outfitsDb.length; i++){
      let outfit = {}

      let pieceDbtop = await Piece.findById(outfitsDb[i].top);
      let pieceDbbottom = await Piece.findById(outfitsDb[i].bottom);
      let pieceDbshoes = await Piece.findById(outfitsDb[i].shoes);
      
      console.log(pieceDbtop)

      outfit.top = pieceDbtop
      outfit.bottom = pieceDbbottom
      outfit.shoes = pieceDbshoes

      outfitsArr.push(outfit)
    }

    res.render('private/results',{outfits: outfitsDb, results: outfitsArr})
    //res.send({outfits: outfitsDb, results: outfitsArr})
  }
  catch(err){
    console.error(err);
  }
})

// edit
router.get('/outfit/:outfitId/edit',isLoggedIn, async (req,res) => {
  let {outfitId} = req.params
  try {
    const outfitDb = await Outfit.findById(outfitId)
    const pieceDbtop = await Piece.find({pieceType: "top"})
    const pieceDbbottom = await Piece.find({pieceType: "bottom"})
    const pieceDbshoes = await Piece.find({pieceType: "shoes"})
    res.render('private/edit', {id: outfitId, outfitObj: outfitDb, pieces:{top:pieceDbtop, bottom:pieceDbbottom, shoes:pieceDbshoes}})
    //res.send({id: outfitId, outfitObj: outfitDb, pieces:{top:pieceDbtop, bottom:pieceDbbottom, shoes:pieceDbshoes}})
  } catch (error) {
    console.log(error)
  }
})

/*
ERA FIXE GUARDAR O OUTFIT NUMA COOKIE para não fazer chamadas a mais para a DB
*/

//ainda falta testar esta logica
router.post('/outfit/:outfitId/edit', isLoggedIn, async (req,res) => {
  let {outfitId} = req.params
  let {top, bottom, shoes} = req.body

  try {
    let topPieceDb = await Piece.find({name: top});
    let bottomPieceDb = await Piece.find({name: bottom});
    let shoesPieceDb = await Piece.find({name: shoes});

    let updateOutfit = {};
    updateOutfit[outfitId]={}
    updatedOutfit[outfitId].top = topPieceDb[0]._id;
    updatedOutfit[outfitId].bottom = bottomPieceDb[0]._id;
    updatedOutfit[outfitId].shoes = shoesPieceDb[0]._id;

    await Outfit.findByIdAndUpdate(updateOutfit);
  }catch(err){
    console.log(err)
  }
  
})

// create
router.get('/outfit/create', async (req,res) => {
  try {
    const pieceDbtop = await Piece.find({pieceType: "top"})
    const pieceDbbottom = await Piece.find({pieceType: "bottom"})
    const pieceDbshoes = await Piece.find({pieceType: "shoes"})
    res.render('private/create', {pieces:{top:pieceDbtop, bottom:pieceDbbottom, shoes:pieceDbshoes}})
  } catch (error) {
    console.log(error)
  }
})

router.post('/outfit/create', async (req,res) => {
  let {top, bottom, shoes} = req.body

  try {
    let topPieceDb = await Piece.find({name: top});
    let bottomPieceDb = await Piece.find({name: bottom});
    let shoesPieceDb = await Piece.find({name: shoes});

    let createOutfit = {};
    createOutfit.top = topPieceDb[0]._id;
    createOutfit.bottom = bottomPieceDb[0]._id;
    createOutfit.shoes = shoesPieceDb[0]._id;

    await Outfit.create(createOutfit)
    res.redirect('/profile')
  }catch(err){
    console.log(err)
  }
})

module.exports = router;