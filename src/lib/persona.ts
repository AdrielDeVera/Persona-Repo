import Persona from 'persona'

export interface PersonaConfig {
  templateId: string
  environment: 'sandbox' | 'production'
  routingCountry?: string
}

export interface PersonaCallbacks {
  onLoad?: () => void
  onReady?: () => void
  onComplete?: (payload: { inquiryId: string; status: string; fields?: Record<string, unknown> }) => void
  onCancel?: () => void
  onError?: (error: any) => void
  onEvent?: (name: string, meta: unknown) => void
}

export function preloadPersona(): void {
  try {
    Persona.Client.preload()
    console.log('Persona widget preloaded successfully')
  } catch (error) {
    console.error('Failed to preload Persona widget:', error)
  }
}

export function createPersonaClient(config: PersonaConfig, callbacks: PersonaCallbacks) {
  const client = new Persona.Client({
    templateId: config.templateId,
    environment: config.environment,
    routingCountry: config.routingCountry || 'US',
    ...callbacks
  })

  return client
}
