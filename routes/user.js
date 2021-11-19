const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require('express').Router()
const User = require('../models/User')
const {route} = require("express/lib/router");
const {raw} = require("express");
router.put('/:id', verifyToken, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      $set: req.body
    }, {new: true})

    return res.status(200).json(updatedUser)

  } catch (err) {
    return res.status(500).json(err)
  }

})

//DELETE

router.delete(':/id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted...')
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET
router.get('/find/:/id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
})
//GET ALL USER

router.get('/find-all-users', verifyTokenAndAdmin, async (req, res) => {

  const query = req.query.new//belli sayıdaki kullanıları getirir

  try {
    const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
    res.status(200).json(users)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET USER STATS

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const data = await User.aggregate([
      {
        $match: {createdAt: {$gte: lastYear}}
      },
      {
        $project: {
          month: {$month: "$createdAt"}
        }
      },
      {
        $group: {
          month: "$month",
          total: {$sum: 1}
        }
      }
    ])
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = router