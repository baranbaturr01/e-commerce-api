const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token

  if (authHeader) {
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('token is not valid')
      req.user = user
      next()
    })
  }
  return res.status(401).json('you are not logined')
}
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    }
    res.status(403).json('you are not allowed that')
  })
}
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    }
    res.status(403).json('you are not allowed that')
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}