const { Product } = require('../models');
const multer = require('multer');
const uploadToCloudinary = require('../middlewares/upload-cloud');
const upload = multer({ storage: multer.memoryStorage() });
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
<<<<<<< HEAD
const redis = require('../config/redis'); // Configuração do Redis
const Queue = require('bull');
=======
const authMiddleware = require('../middlewares/auth');

>>>>>>> 3230ad1706d93814d7d4a2f08d5775f0181a4f26

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
<<<<<<< HEAD
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id: id } });

    if (!product) {
      return res.status(404).send('Product not found');
=======
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
>>>>>>> 3230ad1706d93814d7d4a2f08d5775f0181a4f26
    }

    await product.update(req.body);

<<<<<<< HEAD
    // Adicionar à fila de atualização
    await productQueue.add({ type: 'update', data: product });
=======
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
>>>>>>> 3230ad1706d93814d7d4a2f08d5775f0181a4f26

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