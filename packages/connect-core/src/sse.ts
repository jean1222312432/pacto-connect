export interface SseMessage {
  id?: string;
  event?: string;
  data: string;
}

export function parseSseBlock(block: string): SseMessage | null {
  const lines = block.split('\n');
  let id: string | undefined;
  let event: string | undefined;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith(':')) {
      continue;
    }

    if (line.startsWith('id:')) {
      id = line.slice(3).trim();
      continue;
    }

    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0 && !event) {
    return null;
  }

  return {
    id,
    event,
    data: dataLines.join('\n'),
  };
}

export async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onMessage: (message: SseMessage) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) {
        continue;
      }

      const message = parseSseBlock(trimmed);
      if (message) {
        onMessage(message);
      }
    }
  }

  if (buffer.trim()) {
    const message = parseSseBlock(buffer.trim());
    if (message) {
      onMessage(message);
    }
  }
}
