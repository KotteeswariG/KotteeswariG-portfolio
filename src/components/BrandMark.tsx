type Props = {
  size?: number;
  ringed?: boolean;
  className?: string;
};

export function BrandMark({ size = 40, ringed = false, className }: Props) {
  return (
    <span
      className={`brand-mark${ringed ? " brand-mark-ring" : ""}${className ? ` ${className}` : ""}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.round(size * 0.5)}px`,
      }}
      aria-hidden="true"
    >
      K
    </span>
  );
}
