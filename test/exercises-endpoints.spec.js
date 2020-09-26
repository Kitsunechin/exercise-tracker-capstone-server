const knex = require('knex')
const makeExerciseArray  = require('./exercises.fixtures')
const app = require('../src/app')


describe(' Exercises Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('exercises').truncate())

    afterEach('cleanup', () => db('exercises').truncate())


    describe(`GET /api/exercise/user/:user_id`, () => {
        context(`Given no users`, () => {
            it(`responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .get(`/api/exercise/user/${userId}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context('Given there are exercises in the database', () => {
            const testExercises = exercisesFixtures.makeExerciseArray()

            beforeEach('insert exercise', () => {
                return db
                    .into('exercises')
                    .insert(testExercises)
            })

            it('responds with 200 and the specified user', () => {
                const userId = 1
                return supertest(app)
                    .get(`/api/exercise/user/${userId}`)
                    .expect(200, testExercises)
            })
        })

    })

    describe('POST /exercise', function () {

        it('should create and return a new todo when provided valid data', function () {
          const newItem = {
            'name': "running",
            'exercise_length': 30,
            'date': 2020-09-21,
            'notes': "example note"
          };
    
          return supertest(app)
            .post('/exercise')
            .send(newItem)
            .expect(201)
            .expect(res => {
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys('id', 'name', 'exercise_length', 'date', 'notes');
              expect(res.body.name).to.equal(newItem.name);
              expect(res.body.exercise_length).to.equal(newItem.exercise_length);
              expect(res.body.date).to.equal(newItem.date);
              expect(res.body.notes).to.equal(newItem.notes);
              expect(res.headers.location).to.equal(`/v1/todos/${res.body.id}`)
            });
        });
    
        it('should respond with 400 status when given bad data', function () {
          const badItem = {
            foobar: 'broken item'
          };
          return supertest(app)
            .post('exercise')
            .send(badItem)
            .expect(400);
        });
    
      });

      describe('DELETE /exercise/:id', () => {

        beforeEach('insert some exercise', () => {
          return db('exercise').insert(exercise);
        })
    
        it('should delete an item by id', () => {
          return db('exercise')
            .first()
            .then(doc => {
              return supertest(app)
                .delete(`/exercise/${doc.id}`)
                .expect(204);
            })
        });
    
        it('should respond with a 404 for an invalid id', function () {
          
          return supertest(app)
            .delete('/exercise/aaaaaaaaaaaaaaaaaaaaaaaa')
            .expect(404);
        });
    
      });
})