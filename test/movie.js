/* eslint-disable no-undef */
const { chai, server } = require('./testConfig')
const MovieModel = require('../models/MovieModel')

/**
 * Test cases to test all the movie APIs
 * Covered Routes:
 * (1) Log in
 * (2) Store movie
 * (3) Get all movie
 * (4) Get single movie
 * (5) Recherche par titre
 * (6) Update movie
 * (7) Delete movie

 */

describe('Movie', () => {
  // Before each test we empty the database
  before((done) => {
    MovieModel.deleteMany({}, () => {
      done()
    })
  })

  // Prepare data for testing
  const userTestData = {
    password: 'Test@123',
    email: 'maitraysuthar@test12345.com',
  }

  // Prepare data for testing
  const testData = {
    title: 'testing movie',
    description: 'testing movie desc',
    isan: '3214htrff4',
    author: 'toto',
    year: new Date('1991-03-31'),
  }

  /*
  * Test the /POST route
  */
  describe('/POST Login', () => {
    it('it should do user Login for movie', (done) => {
      chai.request(server)
        .post('/api/auth/login')
        .send({ email: userTestData.email, password: userTestData.password })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Login Success.')
          userTestData.token = res.body.data.token
          done()
        })
    })
  })

  /*
  * Test the /POST route
  */
  describe('/POST Movie Store', () => {
    it('It should send validation error for store movie', (done) => {
      chai.request(server)
        .post('/api/movie')
        .send()
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  /*
  * Test the /POST route
  */
  describe('/POST Movie Store', () => {
    it('It should store movie', (done) => {
      chai.request(server)
        .post('/api/movie')
        .send(testData)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Objet add Success.')
          done()
        })
    })
  })

  /*
  * Test the /GET route
  */
  describe('/GET All movie', () => {
    it('it should GET all the movies', (done) => {
      chai.request(server)
        .get('/api/movie')
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          testData._id = res.body.data[0]._id
          done()
        })
    })
  })

  /*
  * Test the /GET route with query
  */
  describe('/GET All movie with author=toto', () => {
    it('it should GET the toto movie', (done) => {
      chai.request(server)
        .get('/api/movie?author=toto')
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          testData._id = res.body.data[0]._id
          done()
        })
    })
  })

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id movie', () => {
    it('it should GET the movies', (done) => {
      chai.request(server)
        .get(`/api/movie/${testData._id}`)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          done()
        })
    })
  })

  /*
* Test the /GET/:title route
*/
  describe('/GET/:title movie', () => {
    it('it should GET the movies', (done) => {
      chai.request(server)
        .get(`/api/movie/title/${testData.title}`)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          done()
        })
    })
  })

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id movie', () => {
    it('it should PUT the movies', (done) => {
      chai.request(server)
        .put(`/api/movie/${testData._id}`)
        .send(testData)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Objet update Success')
          done()
        })
    })
  })

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id movie', () => {
    it('it should DELETE the movies', (done) => {
      chai.request(server)
        .delete(`/api/movie/${testData._id}`)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Objet delete Success.')
          done()
        })
    })
  })
})
