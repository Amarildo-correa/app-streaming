/**
 * `onArrowPress` dispara no card que ainda está focado, no instante da tecla;
 * `onFocus` dispara logo depois, no card que acabou de receber o foco. Esta
 * ponte deixa o card de destino (e o Hero da Home) saber de que lado o
 * usuário veio, para deslizar (`translateX`) no sentido da navegação.
 *
 * Dois consumidores independentes leem a mesma direção no mesmo ciclo (o
 * próprio `MovieCard` e o `Hero`), então a limpeza é adiada para uma
 * macrotask (`setTimeout`) em vez de zerar na primeira leitura — assim
 * ambos recebem o valor antes dele ser descartado.
 */
let lastDirection: 'left' | 'right' | null = null;
let clearScheduled = false;

export function recordArrowDirection(direction: string): void {
  if (direction === 'left' || direction === 'right') {
    lastDirection = direction;
    clearScheduled = false;
  }
}

export function consumeArrowDirection(): 'left' | 'right' | null {
  const direction = lastDirection;
  if (direction && !clearScheduled) {
    clearScheduled = true;
    setTimeout(() => {
      lastDirection = null;
      clearScheduled = false;
    }, 0);
  }
  return direction;
}
