import app from './app'
import logger from './common/logger'
import mongodb from './services/db'
import './common/env'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  logger.info(`Application running on port : ${PORT}`)
  mongodb.Connection
})