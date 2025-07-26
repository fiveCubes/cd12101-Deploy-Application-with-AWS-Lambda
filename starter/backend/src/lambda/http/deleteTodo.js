
import {deleteTodo} from '../../businessLogic/todos.js'
import {deleteS3Object} from '../../fileStorage/attachmentUtils.js'



export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = event.requestContext.authorizer.userId

  await deleteTodo(userId, todoId)

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
