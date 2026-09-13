import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { Icon } from './Icon';
import { scrollFocusedIntoView } from '../utils/scrollFocusedIntoView';
import './FocusableButton.css';

interface FocusableButtonProps {
  label: string;
  iconName?: string;
  onPress: () => void;
  focusKey?: string;
  variant?: 'primary' | 'secondary';
}

export function FocusableButton({ label, iconName, onPress, focusKey, variant = 'secondary' }: FocusableButtonProps) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onPress,
    onFocus: () => scrollFocusedIntoView(ref.current, 'center'),
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`focusable-button focusable-button--${variant} ${focused ? 'is-focused' : ''}`.trim()}
      onClick={onPress}
    >
      {iconName ? <Icon name={iconName} /> : null}
      <span>{label}</span>
    </button>
  );
}
