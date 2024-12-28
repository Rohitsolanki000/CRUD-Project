var express = require('express');
var router = express.Router();
const connection = require('../db');
const multer = require('multer');

// Configure multer to store images in the 'public/images' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});
const upload = multer({ storage: storage });

// Create product with image upload
router.post('/create', upload.single('image'), function (req, res, next) {
    var product_name = req.body.product_name;
    var sku = req.body.sku;
    var price = req.body.price;
    var image_path = req.file ? `/images/${req.file.filename}` : null; // Image path

    var sql = `INSERT INTO products (product_name, sku, price, image_url) VALUES ("${product_name}", "${sku}", "${price}", "${image_path}")`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/products'); // After creating, redirect to the products page
    });
});


// Get all products
router.get('/', function (req, res, next) {
    var query = 'SELECT * FROM products';
    connection.query(query, function (err, rows, field) {
        if (err) throw err;
        res.render('products', { title: 'Products', products: rows });
    });
});


// Create product form
router.get('/create-form', function (req, res, next) {
    res.render('createform', { title: 'Create Product' });
});

// Edit product form
router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    var sql = `SELECT * FROM products WHERE id=${id}`;
    connection.query(sql, function (err, rows, field) {
        if (err) throw err;
        res.render('editform', { title: 'Edit Product', product: rows[0] });
    });
});


router.post('/edit/:id', upload.single('image'), function (req, res, next) {
    var product_name = req.body.product_name;
    var sku = req.body.sku;
    var price = req.body.price;
    var id = req.params.id;

    var image_path = req.file ? `/images/${req.file.filename}` : null;

    var sql = image_path
        ? `UPDATE products SET product_name="${product_name}", sku="${sku}", price="${price}", image_url="${image_path}" WHERE id="${id}"`
        : `UPDATE products SET product_name="${product_name}", sku="${sku}", price="${price}" WHERE id="${id}"`;

    connection.query(sql, function (err, result) {
        if (err) {
            return res.json({ success: false, message: 'Failed to update product' });
        }
        res.json({ success: true, message: 'Product updated successfully' });
    });
});



// Delete product
router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM products WHERE id=${id}`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/products');
    });
});


module.exports = router;
