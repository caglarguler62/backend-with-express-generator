const express = require('express')
const router = express.Router()
//Model
const DirectorModel = require('../models/Director')

const mongoose = require('mongoose')
//=> /api/directors/:directorId
router.get('/:directorId',(req,res,next)=>{
    DirectorModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.directorId) } },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "director_id",
          as: "movies",
        },
      },
    ])
      .then((data) => {res.json(data);})
      .catch((err) => {res.json(err);});
})
router.get('/',(req,res,next)=>{
    DirectorModel.aggregate([
        {
            $lookup:{
                from:'movies',
                localField:'_id',
                foreignField:'director_id',
                as:'movies'
            }
        },
        {
            $project:{
                _id:1,
                name:1,
                surname:true,
                'movies.title':1,
                'movies.imdb_score':1
            }
        }
    ])
    .then((directorList)=>{res.json(directorList)})
    .catch((err)=>{next({message:err});})
})

router.post("/",(req,res,next)=>{
    const newDirector = new DirectorModel(req.body)
    newDirector.save()
                .then((director)=>{res.json(director)})
                .catch((err)=>{next({message:err});
                     /*res.json(err)*/})
})

//=> /api/directors/:directorId
router.put('/:directorId',(req,res,next)=>{
    DirectorModel.findByIdAndUpdate(req.params.directorId,req.body,{new:true})
                        .then((director)=>{res.json(director)})
                        .catch((err)=>{next({message:err});})
})

//=> /api/directors/:directorId
router.delete('/:directorId',(req,res,next)=>{
    DirectorModel.findByIdAndRemove(req.params.directorId)
                        .then((director)=>{res.json(director)})
                        .catch((err)=>{next({message:err});})
})


module.exports = router