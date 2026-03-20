import Image from "next/image";

export default function Logo({ size = 85 }: { size?: number }) {
  return (
    <Image
      src="/images/logo.svg"
      alt="Jeffrey Mariano"
      width={size}
      height={size}
    />
  );
}
