const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
//REGISTER
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
  })
  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser)
  } catch (err) {
    console.log(err)
  }

  //LOGIN

  router.post('/login', async (req, res) => {

    const username = req.body.username

    try {
      const user = await User.findOne({username: username})
      ! user && res.status(401).json('Yanlis Bilgiler')
      const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString()

      const password = hashedPassword.toString(CryptoJS.enc.Utf8)

      password !== req.body.password && res.status(401).json('Yanlis Bilgiler')

      const accessToken = jwt.sign({
          id: user._id,
          isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn: '3d'}
      )

      res.status(200).json(accessToken)

    } catch (err) {
      res.status(500).json(err)
    }


  })

})
module.exports = router