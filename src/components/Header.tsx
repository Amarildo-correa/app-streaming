import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import './Header.css';

const items = [
  { key: 'inicio', label: 'Início' },
  { key: 'filmes', label: 'Filmes' },
  { key: 'seriados', label: 'Seriados' },
  { key: 'minha-lista', label: 'Minha Lista' },
];

function HeaderButton({ label, itemKey }: { label: string; itemKey: string }) {
  const { ref, focused, focusSelf } = useFocusable({ focusKey: `header-${itemKey}` });

  return (
    <button
      ref={ref}
      type="button"
      className={`header__button ${focused ? 'is-focused' : ''}`.trim()}
      onFocus={() => focusSelf()}
      onClick={() => focusSelf()}
    >
      {label}
    </button>
  );
}

export function Header() {
  const { ref, focusKey } = useFocusable({
    focusKey: 'header-nav',
    isFocusBoundary: true,
    focusBoundaryDirections: ['left', 'right', 'up'],
  });

  return (
    <header className="header">
      <FocusContext.Provider value={focusKey}>
        <nav ref={ref} className="header__nav" aria-label="Navegação principal">
          {items.map(({ key, label }) => (
            <HeaderButton key={key} itemKey={key} label={label} />
          ))}
        </nav>
      </FocusContext.Provider>
    </header>
  );
}
