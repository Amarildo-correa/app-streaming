import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { getMovieBySlug } from '../data/movies';
import { FocusableButton } from '../components/FocusableButton';
import { CastMemberButton } from '../components/CastMemberButton';
import { NotFound } from './NotFound';
import './MovieDetail.css';

export function MovieDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const movie = getMovieBySlug(decodeURIComponent(slug));
  const { ref, focusKey, focusSelf } = useFocusable({ isFocusBoundary: true });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Escape') {
        event.preventDefault();
        navigate('/', { state: { fromSlug: movie?.slug } });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, movie?.slug]);

  if (!movie) {
    return <NotFound />;
  }

  const goBack = () => navigate('/', { state: { fromSlug: movie.slug } });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="movie-detail">
        <img
          className="movie-detail__backdrop"
          src={movie.backdropUrl}
          width={1280}
          height={720}
          loading="lazy"
          alt=""
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-detail-fallback/1280/720`;
          }}
        />
        <div className="movie-detail__body">
          <img
            className="movie-detail__poster"
            src={movie.posterUrl}
            width={200}
            height={300}
            loading="lazy"
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://picsum.photos/seed/${movie.slug}-poster-fallback/200/300`;
            }}
          />
          <div className="movie-detail__info">
            <h1>{movie.title}</h1>
            <p className="movie-detail__meta">
              {movie.year} · {movie.durationMinutes} min · {movie.ageRating} · ★ {movie.voteAverage.toFixed(1)} ·{' '}
              {movie.genres.join(', ')}
            </p>
            <p className="movie-detail__synopsis">{movie.synopsis}</p>
            <p className="movie-detail__director">Direção: {movie.director}</p>
            <div className="movie-detail__actions">
              <FocusableButton label="Assistir" iconName="play_arrow" onPress={() => {}} focusKey="detail-watch" />
              <FocusableButton
                label="Minha lista"
                iconName="add"
                variant="secondary"
                onPress={() => {}}
                focusKey="detail-list"
              />
              <FocusableButton
                label="Voltar"
                iconName="arrow_back"
                variant="secondary"
                onPress={goBack}
                focusKey="detail-back"
              />
            </div>
          </div>
        </div>
        <section className="movie-detail__cast">
          <h2>Elenco</h2>
          <div className="movie-detail__cast-grid">
            {movie.cast.map((member) => (
              <div key={member.name} className="cast-member">
                <CastMemberButton member={member} movieSlug={movie.slug} />
                <span className="cast-member__name">{member.name}</span>
                <span className="cast-member__character">{member.character}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </FocusContext.Provider>
  );
}
