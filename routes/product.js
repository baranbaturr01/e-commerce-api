const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require('express').Router()
const Product = require('../models/Product')
const {route} = require("express/lib/router");
const {raw} = require("express");

router.post('/', verifyTokenAndAdmin, async (req, res) => {

  const newProduct = new Product(req.body)

  try {

    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)

  } catch (err) {
    res.status(500).json(err)
  }

})


//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.user.id, {
      $set: req.body
    }, {new: true})

    return res.status(200).json(updatedProduct)

  } catch (err) {
    return res.status(500).json(err)
  }

})

//DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleteUser = await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted...')
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET PRODUCT
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
  } catch (err) {
    return res.status(500).json(err)
  }
})
//GET ALL PRODUCT

router.get('/', async (req, res) => {

  const qNew = req.query.new
  const qCategory = req.query.category
  try {
    let products
    if (qNew) {
      products = await Product.find().sort({createdAt: -1}).limit(5)
    } else if (qCategory) {
      products = await Product.find({categories: {$in: [qCategory]}})
    } else {
      products = await Product.find()
    }

    res.status(200).json(products)
  } catch (err) {
    return res.status(500).json(err)
  }
})


module.exports = router