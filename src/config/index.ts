import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const CREDENTIALS = process.env.CREDENTIALS === 'true'
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env

export const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env
export const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env
export const { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_HASH_KEY } = process.env
export const { AWS_S3_BUCKET, AWS_S3_ACCESS_KEY, AWS_S3_KEY_SECRET, AWS_S3_REGION } = process.env
