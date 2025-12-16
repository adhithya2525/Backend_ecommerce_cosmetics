const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, searchProducts } = require('../Controllers/ProductController');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;