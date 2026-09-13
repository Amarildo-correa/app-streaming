import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import type { CastMember } from '../data/movies';
import { scrollFocusedIntoView } from '../utils/scrollFocusedIntoView';

interface CastMemberButtonProps {
  member: CastMember;
  movieSlug: string;
}

export function CastMemberButton({ member, movieSlug }: CastMemberButtonProps) {
  const { ref, focused, focusSelf } = useFocusable({
    focusKey: `cast-${movieSlug}-${member.name}`,
    onFocus: () => scrollFocusedIntoView(ref.current, 'center'),
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`cast-member__button ${focused ? 'is-focused' : ''}`.trim()}
      onFocus={() => focusSelf()}
      onClick={() => focusSelf()}
    >
      <img
        src={member.photoUrl}
        width={100}
        height={100}
        loading="lazy"
        alt={member.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://picsum.photos/seed/${movieSlug}-cast-fallback/100/100`;
        }}
      />
    </button>
  );
}
