const router = require('express').Router();

// Controller imports
const { categoryController, productController, authController } = require('../controllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: O ID da categoria
 *         name:
 *           type: string
 *           description: O nome da categoria
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "1"
 *         name: "Electronics"
 *         createdAt: "2024-12-15T10:00:00.000Z"
 *         updatedAt: "2024-12-15T12:00:00.000Z"
 */

/**
 * @swagger
 * /v1/categories:
 *   get:
 *     summary: Retorna todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/v1/categories', categoryController.getAllCategories);

/**
 * @swagger
 * /v1/categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.post('/v1/categories', categoryController.createCategory);

/**
 * @swagger
 * /v1/categories/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada.
 */
router.get('/v1/categories/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /v1/categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
router.put('/v1/categories/:id', categoryController.updateCategory);

/**
 * @swagger
 * /v1/categories/{id}:
 *   delete:
 *     summary: Exclui uma categoria pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID da categoria
 *     responses:
 *       204:
 *         description: Categoria excluída com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
router.delete('/v1/categories/:id', categoryController.deleteCategory);


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do produto
 *         name:
 *           type: string
 *           description: O nome do produto
 *         quantity:
 *           type: integer
 *           description: Quantidade do produto
 *         inStock:
 *           type: boolean
 *           description: Indica se o produto está em estoque
 *         productImage:
 *           type: string
 *           description: URL da imagem do produto
 *         price:
 *           type: integer
 *           description: Preço do produto
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Data de validade do produto
 *       example:
 *         id: "1"
 *         name: "Smartphone"
 *         quantity: 100
 *         inStock: true
 *         productImage: "http://example.com/image.jpg"
 *         price: 499
 *         expiryDate: "2025-12-31"
 */

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/v1/products', productController.getAllProducts);

/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/v1/products', productController.createProduct);

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 */
router.get('/v1/products/:id', productController.getProductById);

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.put('/v1/products/:id', productController.updateProductById);

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     summary: Exclui um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.delete('/v1/products/:id', productController.deleteProductById);


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do usuário
 *         username:
 *           type: string
 *           description: Nome de usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *       example:
 *         id: "1"
 *         username: "johndoe"
 *         password: "password123"
 */

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/v1/auth/signup', authController.signup);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/v1/auth/login', authController.login);

module.exports = router;