const express = require('express')
const router = express.Router();

//Model
const MovieModel = require('../models/Movie');

//GET All Movies : localhost:3000/movies/
router.get('/', (req, res) => {
  MovieModel.find()
    .then((movieList)=>{res.json(movieList)})
    .catch((errMsg)=>{res.json(errMsg)})
})

//get movies with director

router.get('/listWithDirectors', (req, res, next)=>{
  MovieModel.aggregate([
    {
      $lookup:{
        from: 'director',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    }
  ])
  .then((movie)=>{res.json(movie)})
  .catch((err)=>{next({message:err})});
})

//GET TOP TEN Movies : localhost:3000/movies/top10/
router.get('/top10', (req, res) => {
  MovieModel.find().sort({imdb_score:-1}).limit(10)
    .then((movieList)=>{res.json(movieList)})
    .catch((errMsg)=>{res.json(errMsg)})
})

//GET Between Movies : localhost:3000/movies/between/:startYear/:endYear
router.get('/between/:startYear/:endYear', (req, res) => {
const {startYear, endYear} = req.params
  //Greater Than or Equal & Less Than or Equal
  //parseInt converts text to number
  MovieModel.find({year:{'$gte':parseInt(startYear), '$lte': parseInt(endYear)}})
    .then((movieList)=>{res.json(movieList)})
    .catch((errMsg)=>{res.json(errMsg)})
})

//GET All Movies : localhost:3000/movies/:movieId
router.get('/:movieId', (req, res) => {
  MovieModel.findById(req.params.movieId)
    .then((movie)=>{res.json(movie)})
    .catch((errMsg)=>{res.json(errMsg)})
})

router.post('/', (req,res,next)=>{
 const newMovie = new MovieModel(req.body)
 newMovie.save()
  .then((movie)=>{res.json(movie)})
  .catch((err)=>{next({message:err})});
    // res.json(err)})
})
//Update a movie with new info. /movies/:movieId
router.put("/:movieId",(req,res,next)=>{
  MovieModel.findByIdAndUpdate(req.params.movieId,req.body,{new:true})
    .then((movie)=>{res.json(movie)})
    .catch((err)=>{res.json(err)})
})
//Delete a movie with new info. /movies/:movieId
router.delete("/:movieId",(req,res,next)=>{
  MovieModel.findByIdAndRemove(req.params.movieId)
    .then((movie)=>{res.json(movie)})
    .catch((err)=>{res.json(err)})
})

module.exports = router;