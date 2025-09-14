import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url('Invalid API URL'),
  VITE_IMAGE_URL: z.url('Invalid Image URL'),
  VITE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_SOCKET_URL: z.url('Invalid Socket URL')
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const env = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_IMAGE_URL: import.meta.env.VITE_IMAGE_URL,
    VITE_ENV: import.meta.env.VITE_ENV,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL
  }

  try {
    return envSchema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = Object.keys(error.flatten().fieldErrors)
      throw new Error(`❌ Invalid environment variables: ${missingVars.join(', ')}\n${error.message}`)
    }
    throw error
  }
}

export default validateEnv()
