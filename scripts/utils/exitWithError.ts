export function exitWithError(...message: string[]): void {
  const messageCount = message.length
  const lines: string[] = []
  addLines(messageCount, message, lines)
  if (lines.length > 0) {
    console.error(`\n${lines.join('\n')}`)
  }
  process.exit(1);
}

function addLines(messageCount: number, message: string[], lines: string[]) {
  for (let i = 0; i < messageCount; i += 1) {
    if (typeof message[i] === 'string') {
      lines.push(message[i])
    } else if (Array.isArray(message[i])) {
      addLines(message[i].length, message[i] as unknown as string[], lines)
    }
  }
}
