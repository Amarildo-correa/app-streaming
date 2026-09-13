import type { SyntheticEvent } from 'react';

export function picsumUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Troca a imagem por outro seed quando o recurso original falha, sem
 * reentrar no handler caso o fallback também falhe.
 */
export function applyPicsumFallback(
  event: SyntheticEvent<HTMLImageElement>,
  seed: string,
  width: number,
  height: number,
): void {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = picsumUrl(seed, width, height);
}
