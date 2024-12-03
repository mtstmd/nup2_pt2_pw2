const { Product } = require('../models');
const multer = require('multer');
const uploadToCloudinary = require('../middlewares/upload-cloud');
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/auth');


/**
 * Creates a new product
 * @param {*} req
 * @param {*} res
 * @returns Object
 */
const createProduct = [
  // Upload de arquivo em disco
  upload.single('productImage'),

  // Upload de arquivo em nuvem
  uploadToCloudinary,
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('price').isNumeric().withMessage('O preço deve ser numérico'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Transformação dos dados
    const transformedData = {
      ...req.body,
      id: uuidv4(),
      name: req.body.name.toLowerCase(),
      // productImage: req.file ? req.file.filename : null, // Upload de arquivo em disco
      productImage: req.cloudinaryUrl || null, // Upload de arquivo em nuvem
      expiryDate: new Date()
    };

    try {
      const product = await Product.create(transformedData);
      return res.status(201).json(
        product
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
];


/**
 * Fetches all products
 * @param {*} req
 * @param {*} res
 * @returns Object
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] })

    return res.status(200).json( products )
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

/**
 * Gets a single product by it's id
 * @param {*} req
 * @param {*} res
 * @returns boolean
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({
      where: { id: id }
    })

    if (product) {
      return res.status(200).json( product )
    }

    return res.status(404).send('Product with the specified ID does not exist')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
/**
 * Updates a single product by it's id
 * @param {*} req
 * @param {*} res
 * @returns boolean
 */
const updateProductById = [
<<<<<<< HEAD
  upload.single('productImage'),

=======
  // Upload de arquivo em disco
  upload.single('productImage'),

  // Upload de arquivo em nuvem
>>>>>>> 416b6b3b90495ec8d631e8619f13c5bbb7dae31d
  uploadToCloudinary,

  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('price').optional().isNumeric().withMessage('O preço deve ser numérico'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      let product = await Product.findOne({ where: { id: id } });

      if (!product) {
        return res.status(404).send('Product not found');
      }

<<<<<<< HEAD
      const updatedData = { ...req.body };

=======
      // Transformação de dados antes de atualizar
      const updatedData = { ...req.body };

      // Atualizar nome para minúsculo, se enviado
>>>>>>> 416b6b3b90495ec8d631e8619f13c5bbb7dae31d
      if (updatedData.name) {
        updatedData.name = updatedData.name.toLowerCase();
      }

<<<<<<< HEAD
      if (req.cloudinaryUrl) {
        updatedData.productImage = req.cloudinaryUrl;
      } else if (req.file) {
        updatedData.productImage = req.file.filename; 
=======
      // Atualizar a imagem do produto, se uma nova for enviada
      if (req.cloudinaryUrl) {
        updatedData.productImage = req.cloudinaryUrl; // Para upload em nuvem
      } else if (req.file) {
        updatedData.productImage = req.file.filename; // Para upload local
>>>>>>> 416b6b3b90495ec8d631e8619f13c5bbb7dae31d
      }

      await product.update(updatedData);

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
];



/**
 * Deletes a single product by it's id
 * @param {*} req
 * @param {*} res
 * @returns boolean
 */
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params

    const deletedProduct = await Product.destroy({
      where: { id: id }
    })

    if (deletedProduct) {
      return res.status(204).send('Product deleted successfully ')
    }

    throw new Error('Product not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  createProduct: [authMiddleware, createProduct],
  getAllProducts: [authMiddleware, getAllProducts],
  getProductById: [authMiddleware, getProductById],
  deleteProductById: [authMiddleware, deleteProductById],
  updateProductById: [authMiddleware, updateProductById]
}