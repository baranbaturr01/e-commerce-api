const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const router = require('express').Router()
const Order = require('../models/Order')
const User = require("../models/User");

router.post('/', verifyToken, async (req, res) => {

  const newOrder = new Order(req.body)

  try {

    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)

  } catch (err) {
    res.status(500).json(err)
  }

})


//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

  try {
    const updateOrder = await Order.findByIdAndUpdate(req.user.id, {
      $set: req.body
    }, {new: true})

    return res.status(200).json(updateOrder)

  } catch (err) {
    return res.status(500).json(err)
  }

})

//DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been deleted...')
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET USER PRODUCT
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({userId: req.params.userId})
    res.status(200).json(order)
  } catch (err) {
    return res.status(500).json(err)
  }
})
//GET ALL PRODUCT

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {

    const orders = await Order.find()

    res.status(200).json(carts)
  } catch (err) {
    req.status(500).json(err)
  }

})
//GET MONTLY INCOME


router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))


  try {
    const income = await Order.aggregate([
      {
        $match: {createdAt: {$gte: previousMonth}}
      },
      {
        $project: {
          month: {$month: "$createdAt"},
          sales: "$amount"
        }
      },
      {
        $group: {
          month: "$month",
          total: {$sum: "$sales"}
        }
      }
    ])
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router