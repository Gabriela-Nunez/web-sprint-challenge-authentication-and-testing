const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

const user = {username: 'Fred', password: '1234'}

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  test('returns a 200 OK status code', async () => {
    const newUser = {username: 'Fred', password: '1234'}
    const res = await request(server)
      .post('/api/auth/register')
      .send(newUser)
      expect(res.status).toEqual(200)
  })
  test('returns a JSON object', async () => {
    const user = {username: 'James', password: '1234'}
    const res = await request(server)
      .post('/api/auth/login')
      .send(user)
      expect(res.type).toEqual('application/json')
  })
})
describe('[POST] /api/auth/login', () => {
  test("returns 'welcome, ${username}' upon successful login", async () => {
    const newUser = {username: 'James', password: '1234'}
    await request(server)
      .post('/api/auth/register')
      .send(newUser)
    const res = await request(server)
      .post('/api/auth/login')
      .send(newUser)
      expect(res.body.message).toEqual('welcome, James')
  })
  test("returns token upon successful login", async () => {
    const newUser = {username: 'James', password: '1234'}
    await request(server)
      .post('/api/auth/register')
      .send(newUser)
    const res = await request(server)
      .post('/api/auth/login')
      .send(newUser)
      expect(res.body.token).toBeTruthy()
  })
  test("returns 'invalid credentials' when password is incorrect", async () => {
    const newUser = {username: 'James', password: '1234'}
    await request(server)
      .post('/api/auth/register')
      .send(newUser)
    const res = await request(server)
      .post('/api/auth/login')
      .send({username: 'James', password: 'incorrect password'})
      expect(res.body.message).toEqual('invalid credentials')
  })
})
describe('[GET] /api/jokes', () => {
  test('returns a 401 error status when no token given', async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.status).toBe(401)
  })
  test("returns'token required' message when token missing", async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.body.message).toBe('token required')
  })
})