const bcrypt = require('bcryptjs')
const db = require('../../data/dbConfig')

const checkCredentialsExist = (req, res, next) => {
  const { username, password } = req.body

  if(!username || !password) {
    next({ status: 401, message: "username and password required"})
  } else {
    next()
  }
}

const checkUsernameIsUnique = async (req, res, next) => {
  const { username } = req.body
  const existing = await db('users').where({username}).first()
  if(!existing) {
    next()
  } else {
    next({ status: 401, message: "username taken" })
  }
}

const checkValidCredentials = async ( req, res, next) => {
  const { username, password } = req.body
  const user = await db('users').where({username}).first()

  if(user && bcrypt.compareSync(password, user.password)) {
    req.user = user
    next()
  } else {
    next({ status: 401, message: "invalid credentials" })
  }
}

module.exports = {
  checkCredentialsExist,
  checkUsernameIsUnique,
  checkValidCredentials
}