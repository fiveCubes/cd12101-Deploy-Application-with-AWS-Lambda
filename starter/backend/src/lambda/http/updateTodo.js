import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import AWSXRay from 'aws-xray-sdk-core'

const dynamoDbClient = DynamoDBDocument.from(AWSXRay.captureAWSClient(new DynamoDB()))

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = event.requestContext.authorizer.userId


  await dynamoDbClient.update({
    TableName: process.env.TODO_TABLE,
    Key: {
      userId,
      todoId,
    },
    UpdateExpression: 'SET done = :done',
    ExpressionAttributeValues: {
      ':done': updatedTodo.done,
    },

  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items: {
        todoId,
        ...updatedTodo,
      },
    }),
  }
}
