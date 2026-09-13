import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { FocusableButton } from '../components/FocusableButton';
import './NotFound.css';

export function NotFound() {
  const navigate = useNavigate();
  const { ref, focusKey, focusSelf } = useFocusable({ isFocusBoundary: true });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="not-found">
        <h1>Filme não encontrado</h1>
        <p>O título que você procura não está disponível no catálogo.</p>
        <FocusableButton
          label="Voltar para a Home"
          iconName="home"
          onPress={() => navigate('/')}
          focusKey="not-found-home"
        />
      </div>
    </FocusContext.Provider>
  );
}
