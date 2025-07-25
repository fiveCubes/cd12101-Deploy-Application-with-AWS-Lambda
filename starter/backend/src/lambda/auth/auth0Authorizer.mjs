import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import jwkToPem from 'jwk-to-pem'

const logger = createLogger('auth')

const jwksUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      },
      context:{
        userId: jwtToken.sub,
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification

  if (!jwt) throw new Error('Invalid token')
  const kid = jwt.header.kid
  const jwks = await Axios.get(jwksUrl)
  const signingKey = jwks.data.keys.find(key => key.kid === kid)

  if (!signingKey) throw new Error('Invalid signing key')
  const pem = jwkToPem(signingKey)
  return jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] })

}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
