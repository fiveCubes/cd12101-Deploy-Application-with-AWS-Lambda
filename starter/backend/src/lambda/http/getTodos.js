import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDbClient = DynamoDBDocument.from(AWSXRay.captureAWSv3Client(new DynamoDB()))

export async function handler(event) {
  // TODO: Get all TODO items for a current user

  const userId = event.requestContext.authorizer.userId
  console.log('UserId:', userId)
  
  const result = await dynamoDbClient.query({
    TableName: process.env.TODO_TABLE,
    IndexName: process.env.TODO_USER_INDEX,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    }
  })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items: result?.Items || [],
    }),
  }
}
