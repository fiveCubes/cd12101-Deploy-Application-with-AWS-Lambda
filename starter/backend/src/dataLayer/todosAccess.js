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

const updateTodoItem = async (todoItem) => {
  await dynamoDbClient.update({
    TableName: process.env.TODO_TABLE,
    Key: {
      userId: todoItem.userId,
      todoId: todoItem.todoId,
    },
    UpdateExpression: 'SET done = :done',
    ExpressionAttributeValues: {
      ':done': todoItem.done,
    },

  })

}

const deleteTodoItem = async (todoItem) => {
  await dynamoDbClient.delete({
    TableName: process.env.TODO_TABLE,
    Key: {
      userId: todoItem.userId,
      todoId: todoItem.todoId,
    },
  })
}

export { createTodoItem, updateTodoItem, deleteTodoItem }