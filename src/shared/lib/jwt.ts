import { jwtDecode } from 'jwt-decode'

export type DecodedJwtToken = {
  iat: number
  exp: number
  sub: string
  roles: string[]
  username: string
}

export const decodeToken = (token: string) => {
  try {
    console.log('Token decoded...')
    return jwtDecode(token) as DecodedJwtToken
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
