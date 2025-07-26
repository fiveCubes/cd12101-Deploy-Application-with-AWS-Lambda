import {updateTodo} from '../../businessLogic/todos.js'


export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = event.requestContext.authorizer.userId

  const todoItem = await updateTodo(userId, todoId, updatedTodo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      items: todoItem
    }),
  }
}
