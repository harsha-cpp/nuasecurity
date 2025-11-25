import nunjucks from 'nunjucks'

// Create a simple in-memory environment; autoescape disabled for SSTI challenge
const env = new nunjucks.Environment(undefined as any, { autoescape: false })

// Expose helper env(name) to access process.env
env.addGlobal('env', (name: string) => {
  if (typeof name !== 'string') return ''
  return process.env[name] ?? ''
})

export function renderTpl(tpl: string, ctx: Record<string, unknown>): string {
  // INTENTIONAL: no sanitization for CTF SSTI challenges
  try {
    return env.renderString(String(tpl ?? ''), ctx)
  } catch (e) {
    return ''
  }
}




