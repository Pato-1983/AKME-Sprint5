const { body } = require ('express-validator')
const path = require('path');
const { error } = require('console');


const validations =[
    body('name').notEmpty() .withMessage('Ingresa un nombre para el producto'),
    
    body('description').notEmpty() .withMessage('Ingresa una descripción'),
    
    body('price')
        .notEmpty() .withMessage('Ingresa el precio').bail() 
        .isNumeric() .withMessage('Ingresa un importe válido'),

    body('image').custom((value, {req}) => {
        const file = req.file
            
        if (!file) {
            throw new Error('Inserta una imagen de perfil');
        }else {
            const acceptedExtensions = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG', '.pneg', '.PNEG'];
            console.log (file)
            console.log (file.filename)
    
                if(!acceptedExtensions.includes (path.extname (file.filename))){
                    throw new Error('Las extenciones validas son: ' + acceptedExtensions.join(', '));
                };
                
        }
        return true;
    }),
    
    body('category').notEmpty() .withMessage('Ingresa una categoría'),
    
    body('color')
        .notEmpty() .withMessage('Ingresa un color'),

    body('discount')
        .isNumeric() .withMessage('Ingresa un valor correcto')
    
]

module.exports = validations;