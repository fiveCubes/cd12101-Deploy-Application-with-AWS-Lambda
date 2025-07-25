import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import {v4 as uuidv4} from 'uuid'
import AWSXRay from 'aws-xray-sdk-core'


const dynamoDBXRay = AWSXRay.captureAWSClient(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDBXRay)

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const todoId = uuidv4()

  const createdAt = new Date().toISOString()
  const userId = event.requestContext.authorizer.userId

  console.log("authorization header:", userId)

  console.log('Creating new TODO item:', {
    todoId,
    createdAt,
    userId,
    ...newTodo,
  })


  // TODO: Implement creating a new TODO item
  await dynamoDbClient.put({
    TableName: process.env.TODO_TABLE,
    Item: {
      todoId,
      createdAt,
      userId,
      done: false,
      attachmentUrl: null, // Default value for attachment URL
      ...newTodo, // Default value for 'done' field
    },
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      item: {
        todoId,
        createdAt,
        userId,
        done: false,
        attachmentUrl: null, // Default value for attachment URL
        ...newTodo,
      },
    }),
  }
}

