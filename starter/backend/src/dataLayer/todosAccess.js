import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDBXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDBXRay)


const createTodoItem = async (todoItem) => {
  await dynamoDbClient.put({
    TableName: process.env.TODO_TABLE,
    Item: todoItem,
  })
}

export { createTodoItem }