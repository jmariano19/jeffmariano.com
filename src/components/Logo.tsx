import Image from "next/image";

interface LogoProps {
  size?: number;
  rotateOuter?: boolean;
}

export default function Logo({ size = 85, rotateOuter = false }: LogoProps) {
  return (
    <span
      aria-label="Jeffrey Mariano"
      className="relative inline-block shrink-0"
      role="img"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/Logo/logo_text.svg"
        alt=""
        aria-hidden="true"
        fill
        className={rotateOuter ? "logo-outer-spin" : undefined}
        sizes={`${size}px`}
      />
      <Image
        src="/images/Logo/logo-center.svg"
        alt=""
        aria-hidden="true"
        width={size * (28 / 90)}
        height={size * (28 / 90)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}
