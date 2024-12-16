const { Category, Product } = require('../models');
const { v4: uuidv4 } = require('uuid');
const transporter = require('../config/nodemailer');
const authMiddleware = require('../middlewares/auth');
const redis = require('../config/redis'); // Configuração do Redis
const Queue = require('bull');

/**
 * Creates a new category
 * @param {*} req
 * @param {*} res
 * @returns Object
 */
const categoryQueue = new Queue('categoryQueue');

categoryQueue.process(async (job) => {
  const { type, data } = job;
  if (type === 'create') {
    const mailOptions = {
      from: 'nicole.souza@academico.uncisal.edu.br',
      to: 'nicole.tamarindo21@gmail.com',
      subject: 'Nova categoria criada',
      text: `Nova categoria criada: ${data.name}`,
      html: `<p>Nova categoria criada: ${data.name}</p>`
    };
    await transporter.sendMail(mailOptions);
  } else if (type === 'update') {
    const mailOptions = {
      from: 'nicole.souza@academico.uncisal.edu.br',
      to: 'nicole.tamarindo21@gmail.com',
      subject: 'Categoria atualizada',
      text: `Categoria atualizada: ${data.name}`,
      html: `<p>Categoria atualizada: ${data.name}</p>`
    };
    await transporter.sendMail(mailOptions);
  }
});

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

const createCategory = async (req, res) => {
  try {
    const category = await Category.create({ ...req.body, id: uuidv4() });
    await categoryQueue.add({ type: 'create', data: category });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches all categories
 * @param {*} req
 * @param {*} res
 * @returns Object
 */
const getAllCategories = [
  cacheMiddleware('categories', 3600),
  async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
      await redis.setex(res.cacheKey, res.cacheDuration, JSON.stringify(categories));
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
];

/**
 * Gets a single category by it's id
 * @param {*} req
 * @param {*} res
 * @returns boolean
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id: id },
      order: [['createdAt', 'DESC']],
    });

    if (category) {
      return res.status(200).json(category);
    }

    return res
      .status(404)
      .send('Category with the specified ID does not exist');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/**
 * Updates a single category by it's id
 * @param {*} req
 * @param {*} res
 * @returns boolean
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id: id } });
    if (updated) {
      const updatedCategory = await Category.findOne({ where: { id: id } });
      await categoryQueue.add({ type: 'update', data: updatedCategory });
      return res.status(200).json(updatedCategory);
    }
    throw new Error('Category not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/**
 * Deletes a single category by it's id
 * @param {*} req
 * @param {*} res
 * @returns Boolean
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({
      where: {
        id: id,
      },
    });

    if (deleted) {
      return res.status(204).send('Category deleted');
    }

    throw new Error('Category not found ');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createCategory: [authMiddleware, createCategory],
  getAllCategories: [authMiddleware, getAllCategories],
  getCategoryById: [authMiddleware, getCategoryById],
  updateCategory: [authMiddleware, updateCategory],
  deleteCategory: [authMiddleware, deleteCategory],
};