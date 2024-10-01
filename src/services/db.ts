import mongoose from 'mongoose'
import logger from '../common/logger'

import '../common/env'

const DB_URI = process.env.MONGO_URL || process.env.LOCAL_CONNECTION_STRING

mongoose.connect(DB_URI)

mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', (err) => logger.error('connection with db error', err))
db.on('close', () => logger.info('connection closed to db'))
db.once('open', () => logger.info(`Connected to the database`))

export default {
  Connection: db,
}
