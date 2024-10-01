import Bluebird from 'bluebird'
import sharp from 'sharp'
import { AWS_S3_ACCESS_KEY, AWS_S3_BUCKET, AWS_S3_KEY_SECRET } from '../config'
const s3Upload = async (base64: string, name: string, folder: string, isImage: boolean = true) => {
  const AWS: any = await import('aws-sdk')

  AWS.config.setPromisesDependency(Bluebird)
  AWS.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_KEY_SECRET,
  })
  const s3 = new AWS.S3()

  const [mime, content] = base64.split(';base64,')
  const [, contentType] = mime.split(':')
  const [, extension] = contentType.split('/')
  const base64Data: Buffer = Buffer.from(content, 'base64')

  let buffer: Buffer
  if (isImage) {
    buffer = await sharp(base64Data).webp({ quality: 60 }).toBuffer()
  } else {
    buffer = base64Data
  }

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: `${folder}/${name}.${extension}`,
    Body: buffer,
    ACL: 'public-read',
    ContentEncoding: isImage ? undefined : 'base64',
    ContentType: contentType,
  }

  let response: any = {}
  try {
    response = await s3.upload(params).promise()
  } catch (error) {
    console.error(error)
    return false
  }
  return {
    ...response,
    size: Buffer.byteLength(buffer),
  }
}

export default s3Upload
