const ExerciseService = {
    getAllExercises(knex) {
        return knex
        .from('exercises')
        .select('*')
    },

    insertExercise(knex,newExercise) {
        console.log('exercise=>',newExercise)
        return knex
        .insert(newExercise)
        .into('exercises')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getExerciseById(knex,id) {
        return knex
        .from('exercises')
        .select('*')
        .where('id',id)
        .first()
    },

    getExerciseByUserId(knex,user_id) {
        return knex
        .from('exercises')
        .select('*')
    },

    deleteExercise(db, exercise_id) {
        return db('exercises')
            .where({
                'id': exercise_id
            })
            .delete()
    }

}
module.exports = ExerciseService