import { useEffect } from 'react';
import { useFocusable, type UseFocusableResult } from '@noriginmedia/norigin-spatial-navigation-react';

type TerminalRouteFocus<E> = Pick<UseFocusableResult<E>, 'ref' | 'focusKey'>;

/**
 * Rotas terminais (MovieDetail, NotFound) são boundaries que só liberam a
 * direção esquerda para alcançar o rail e capturam o foco na montagem.
 */
export function useTerminalRouteFocus<E = HTMLDivElement>(): TerminalRouteFocus<E> {
  const { ref, focusKey, focusSelf } = useFocusable<never, E>({
    isFocusBoundary: true,
    focusBoundaryDirections: ['up', 'down', 'right'],
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return { ref, focusKey };
}
