
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const s3Client = new S3Client({ region: process.env.AWS_REGION })
const urlExpiration = process.env.SIGNED_URL_EXPIRATION || 3600 
const getUploadUrl = async (todoId) => {
  const command = new PutObjectCommand({
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: todoId,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: urlExpiration })
  return url
}

const updateToDoAttachmentUrl = async (userId,todoId) => {
  const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`

  await dynamoDbClient.update({
    TableName: process.env.TODO_TABLE,
    Key: { userId, todoId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl,
    },
  })
  }

  const deleteS3Object = async (todoId) => {
  const bucketName = process.env.ATTACHMENT_S3_BUCKET
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: todoId,
  })
  try {
    await s3Client.send(command)
    console.log(`Deleted S3 object: ${todoId} from bucket: ${bucketName}`)
  } catch (error) {
    console.error(`Failed to delete S3 object: ${todoId}`, error)
  }
}

export { getUploadUrl, updateToDoAttachmentUrl, deleteS3Object }
