
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client({ region: process.env.AWS_REGION })
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDbClient = DynamoDBDocument.from(AWSXRay.captureAWSClient(new DynamoDB()))


export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = event.requestContext.authorizer.userId

  await dynamoDbClient.delete({
    TableName: process.env.TODO_TABLE,
    Key: {
      userId,
      todoId,
    },
  })

  // Delete the S3 object if it exists
  await deleteS3Object(todoId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: null,
  }
}

// delete the s3 object if it exists

export async function deleteS3Object(todoId) {
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


