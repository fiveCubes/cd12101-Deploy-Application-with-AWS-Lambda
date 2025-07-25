import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const s3Client = new S3Client({ region: process.env.AWS_REGION })

const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION || 3600 // Default to 1 hour

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // Generate a signed URL for uploading a file to S3
  const uploadUrl = await getUploadUrl(todoId)
  const userId = event.requestContext.authorizer.userId
  // Update the TODO item with the attachment URL
  await updateToDoAttachmentUrl(userId,todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      uploadUrl,
    }),
  }
}


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


