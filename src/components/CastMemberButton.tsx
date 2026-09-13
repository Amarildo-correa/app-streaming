import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';
import { classNames } from '../utils/classNames';
import { applyPicsumFallback } from '../utils/picsum';
import { scrollFocusedIntoView } from '../utils/scrollFocusedIntoView';
import type { CastMember } from '../data/movies';

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
      className={classNames('cast-member__button', focused && 'is-focused')}
      onFocus={() => focusSelf()}
      onClick={() => focusSelf()}
    >
      <img
        src={member.photoUrl}
        width={100}
        height={100}
        loading="lazy"
        alt={member.name}
        onError={(event) => applyPicsumFallback(event, `${movieSlug}-cast-fallback`, 100, 100)}
      />
    </button>
  );
}
