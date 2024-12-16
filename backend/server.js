if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const routes = require('./routes')

const app = express()

const port = process.env.PORT || 3335

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(helmet())
app.use(cookieParser())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation with Swagger',
    },
    servers: [
      {
        url: `http://localhost:${port}`, // Atualize conforme o servidor em produção
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rotas onde estão as anotações do Swagger
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`)
})