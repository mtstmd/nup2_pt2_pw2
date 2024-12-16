const { Product } = require('../models');
const multer = require('multer');
const uploadToCloudinary = require('../middlewares/upload-cloud');
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
const redis = require('../config/redis'); // Configuração do Redis
const Queue = require('bull');

/**
 * Creates a new product
 * @param {*} req
 * @param {*} res
 * @returns Object
 */

const productQueue = new Queue('productQueue');

productQueue.process(async (job) => {
  const { type, data } = job;
  if (type === 'create') {
    console.log(`Novo produto criado: ${data.name}`);
  } else if (type === 'update') {
    console.log(`Produto atualizado: ${data.name}`);
  }
});

// Função de cache
const cacheMiddleware = (key, duration) => async (req, res, next) => {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    res.cacheKey = key;
    res.cacheDuration = duration;
    next();
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, id: uuidv4() });

    // Adicionar à fila de processamento
    await productQueue.add({ type: 'create', data: product });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Fetches all products
 * @param {*} req
 * @param {*} res
 * @returns Object
 */
const getAllProducts = [
  cacheMiddleware('products', 3600),
  async (req, res) => {
    try {
      const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
      await redis.setex(res.cacheKey, res.cacheDuration, JSON.stringify(products));
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
];

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
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id: id } });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    await product.update(req.body);

    // Adicionar à fila de atualização
    await productQueue.add({ type: 'update', data: product });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


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