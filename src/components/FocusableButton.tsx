import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { Icon } from './Icon';
import { classNames } from '../utils/classNames';
import './FocusableButton.css';

interface FocusableButtonProps {
  label: string;
  iconName?: string;
  onPress: () => void;
  focusKey?: string;
}

/**
 * Os botões de ação (MovieDetail) e o de voltar (NotFound) ficam sempre
 * visíveis perto do topo, então não rolam a janela ao focar — diferente de
 * cards/elenco em carrosséis. Rolar aqui moveria a página inteira e
 * competiria com a animação do `.hero__content-column` (`useHeroContentFlip`).
 */
export function FocusableButton({ label, iconName, onPress, focusKey }: FocusableButtonProps) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onPress,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={classNames('focusable-button', focused && 'is-focused')}
      onClick={onPress}
    >
      {iconName ? <Icon name={iconName} /> : null}
      <span>{label}</span>
    </button>
  );
}
