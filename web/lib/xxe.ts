export async function xxeFetch(path: string, init?: RequestInit) {
  const url = `http://xxe:5000${path}`
  return fetch(url, init)
}




