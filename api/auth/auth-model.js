const db = require('../../data/dbConfig')

function getById(id) {
  return db('users').where('id', id).first()
}

async function insert(newUser) {
  const userId = await db('users').insert(newUser)
  return getById(userId)
}

module.exports = {
  getById,
  insert
}