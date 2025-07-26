import { v4 as uuidv4 } from 'uuid'
import { createTodoItem, updateTodoItem, deleteTodoItem } from '../dataLayer/todosAccess.js'

const createTodo = async (newTodo, userId) => {
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()

  const todoItem = {
    todoId,
    createdAt,
    userId,
    done: false,
    attachmentUrl: '',
    ...newTodo,
  }

  console.log('Creating new TODO item:', todoItem)

  await createTodoItem(todoItem)

  return todoItem
}

const updateTodo = async (userId, todoId, updatedTodo) => {

  const todoItem = {
    todoId,
    userId,
    ...updatedTodo,
  }
  await updateTodoItem(todoItem)

  return todoItem
  
}

const deleteTodo = async (userId, todoId) => {
  const todoItem = {
    todoId,
    userId,
  }

  await deleteTodoItem(todoItem)

  return todoItem
}

export { createTodo, updateTodo, deleteTodo }
