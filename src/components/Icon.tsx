interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span className={`material-symbols-rounded icon ${className ?? ''}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}
