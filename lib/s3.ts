import { S3Client } from '@aws-sdk/client-s3'

let s3Client: S3Client | null = null

export function getS3Client(): S3Client | null {
    const endpoint = process.env.S3_ENDPOINT
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const region = process.env.S3_REGION || 'us-east-1'

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        return null
    }

    if (!s3Client) {
        s3Client = new S3Client({
            region,
            endpoint,
            forcePathStyle: true,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        })
    }

    return s3Client
}
