const express = require ('express')
const  xss = require('xss')
const ExerciseService = require('./exercise-service')

const exerciseRouter = express.Router()
const jsonParser = express.json()

const serializeExercises = exercise => ({
    id: exercise.id,
    exercise_name: exercise.name,
});

exerciseRouter
.route('/')
.get((req,res,next) => {
    const knexInstance = req.app.get('db')
    ExerciseService.getAllExercises(knexInstance)
    .then(exercises => {
        if(exercises.length == 0) {
            return res.status(404).json({
                error: { message: `No visited exercises for this user` }
              })  
        }
        else {
            res.status(200).json(exercises)
        }
    })
    .catch(next)
})

.post(jsonParser, (req,res,next) => {
    const {id, name, user_id, exercise_length, date} = req.body
    const payload = {
        user_id:user_id,
        exercise_id:id,
        name:name,
        exercise_length: exercise_length,
        date: date
    }
    ExerciseService.insertExercise(
        req.app.get('db'),
        payload
    )
    .then(exercise => {
        res
        .status(201)
        .json(exercise)
    })
    .catch(next)
})

exerciseRouter
    .route('/:exercise_id')
    .all((req,res,next) => {
        ExerciseService.getExerciseById(
            req.app.get('db'),
            req.params.exercise_id
        )
        .then(exercise => {
            if (!exercise) {
                return res.status(404).json({
                    error: {message: 'exercise does not exist'}
                })
            }
            res.exercise=exercise
            next()
        })
        .catch(next)
    })
    .get((req,res,next) => {
        res.json(serializeExercises(res.exercise))
    });


exerciseRouter
    .route('/user/:user_id')
    .all((req,res,next) => {
        ExerciseService.getExerciseByUserId(
            req.app.get('db'),
            req.params.user_id
        )
        .then(exercise => {
            if (!exercise) {
                return res.status(404).json({
                    error: {message: 'exercise does not exist'}
                })
            }
            res.exercise=exercise
            next()
        })
        .catch(next)
    })
    .get((req,res,next) => {
        res.json(res.exercise)
    })





module.exports = exerciseRouter