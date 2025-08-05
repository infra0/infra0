export function streamDemoResponse(
  fullResponse: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  durationMs: number = 10000
): () => void {
  let currentIndex = 0
  let isCancelled = false
  
  const totalCharacters = fullResponse.length
  const intervalMs = durationMs / totalCharacters
  
  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval)
      return
    }
    
    if (currentIndex < totalCharacters) {
      const chunk = fullResponse[currentIndex]
      onChunk(chunk)
      currentIndex++
    } else {
      clearInterval(interval)
      onComplete()
    }
  }, intervalMs)
  
  // Return cancel function
  return () => {
    isCancelled = true
    clearInterval(interval)
  }
} 