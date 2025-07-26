import {  createTodo,} from '../../businessLogic/todos.js'

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const userId = event.requestContext.authorizer.userId

  console.log('Authorization header:', userId)

  const todoItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ item: todoItem }),
  }
}
