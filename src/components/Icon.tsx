import { classNames } from '../utils/classNames';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span className={classNames('material-symbols-rounded', 'icon', className)} aria-hidden="true">
      {name}
    </span>
  );
}
