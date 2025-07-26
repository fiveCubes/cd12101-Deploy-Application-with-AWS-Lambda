import { getUploadUrl, updateToDoAttachmentUrl } from "../../fileStorage/attachmentUtils.js"

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // Generate a signed URL for uploading a file to S3
  const uploadUrl = await getUploadUrl(todoId)
  const userId = event.requestContext.authorizer.userId
  // Update the TODO item with the attachment URL
  await updateToDoAttachmentUrl(userId,todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      uploadUrl,
    }),
  }
}


