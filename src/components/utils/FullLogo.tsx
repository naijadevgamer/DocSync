import Image from "next/image";

export default function FullLogo() {
  return (
    <Image
      src="/assets/icons/logo-full.svg"
      height={38}
      width={164}
      alt="DocSync Logo"
      className="h-10 w-fit"
    />
  );
}
