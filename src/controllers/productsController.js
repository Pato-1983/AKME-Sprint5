const fs = require('fs');
const path = require('path');

const jsonDB = require('../model/jsonDatabase');
const productModel = jsonDB ('products')
const products = jsonDB('products') 
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const { validationResult } = require('express-validator')


const controller = {

    products: (req,res) => {
        const products = productModel.readFile();
        res.render('products/products', {products,toThousand})
    },

    detail: (req,res) => { 
        const id = +req.params.id;
        const product = productModel.find(id);    
        res.render('products/productDetail', {product,toThousand})
    },

    create: (req,res) => res.render('products/productCreate'),

    store: (req, res) => {

		const results = validationResult(req)
		
		if (results.errors.length > 0) {
			console.log (results.errors)
			return res.render('products/productCreate', {
				errors:results.mapped(),
				oldData:req.body
			})
		}

		let images = []
		let files = req.files

		files.forEach(image => {
			images.push(image.filename)
		});

		let newProduct = {
			...req.body,
			image: req.files.length >= 1  ? images : ["default-image.jpeg"]
		}

		productModel.create(newProduct)
		res.redirect('/')

	},

    edit: (req,res) => { 
        const id = +req.params.id;
        const product = productModel.find(id);    
        res.render('products/productEdit',{product});
    },

    delete: function(req,res){
        let id = Number(req.params.id);
        products.delete(id);
        res.redirect("/");
    },

	update: (req, res) => {
		let id = Number(req.params.id);
		let productToEdit = productModel.find(id);
		let images = [];
		let files = req.files
		
		files.forEach(image => {
			
			images.push(image.filename)
		});

		productToEdit = {
			id: productToEdit.id,
			...req.body,
			image: files.length >= 1  ? images : productToEdit.image
		}

		productModel.update(productToEdit)
		res.redirect("/");
	},
	
    
    filter: (req,res) => {
        let filtro = req.query;
        const products = productModel.readFile();
        res.render('products/products', {products,toThousand,filtro})
    },

}


module.exports = controller;