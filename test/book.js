/* eslint-disable no-undef */
const { chai, server, faker } = require('./testConfig')
const BookModel = require('../models/BookModel')
const { date } = require('faker')

/**
 * Test cases to test all the book APIs
 * Covered Routes:
 * (1) Log in
 * (2) Store book
 * (3) Get all books
 * (4) Get single book
 * (5) Recherche par titre
 * (6) Update book
 * (7) Delete book

 */

describe('Book', () => {
  // Before each test we empty the database and create new random books
  before((done) => {
    BookModel.deleteMany({}, () => {
      for (let index = 0; index < 20; index++) {
        new BookModel({
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          isbn: faker.random.uuid(),
          author: faker.name.findName(),
          year: new Date(faker.date.past()),
        }).save((err) => { console.error(err) })
      }
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
    title: 'testing book',
    description: 'testing book desc',
    isbn: '3214htrff4',
    author: 'toto',
    year: new Date('1991-03-31'),
  }

  /*
  * Test the /POST route
  */
  describe('/POST Login', () => {
    it('it should do user Login for book', (done) => {
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
  describe('/POST Book Store', () => {
    it('It should send validation error for store book', (done) => {
      chai.request(server)
        .post('/api/book')
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
  describe('/POST Book Store', () => {
    it('It should store book', (done) => {
      chai.request(server)
        .post('/api/book')
        .send(testData)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Book add Success.')
          done()
        })
    })
  })

  /*
  * Test the /GET route
  */
  describe('/GET All book', () => {
    it('it should GET all the books', (done) => {
      chai.request(server)
        .get('/api/book')
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Operation success')
          testData._id = res.body.data[0]._id
          console.log(res.body)
          done()
        })
    })
  })

  /*
  * Test the /GET route with query
  */
  describe('/GET All book with author=toto', () => {
    it('it should GET the toto book', (done) => {
      chai.request(server)
        .get('/api/book?author=toto')
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
  describe('/GET/:id book', () => {
    it('it should GET the books', (done) => {
      chai.request(server)
        .get(`/api/book/${testData._id}`)
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
  describe('/GET/:title book', () => {
    it('it should GET the books', (done) => {
      chai.request(server)
        .get(`/api/book/title/${testData.title}`)
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
  describe('/PUT/:id book', () => {
    it('it should PUT the books', (done) => {
      chai.request(server)
        .put(`/api/book/${testData._id}`)
        .send(testData)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Book update Success')
          done()
        })
    })
  })

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id book', () => {
    it('it should DELETE the books', (done) => {
      chai.request(server)
        .delete(`/api/book/${testData._id}`)
        .set('Authorization', `Bearer ${userTestData.token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Book delete Success.')
          done()
        })
    })
  })
})
