import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/logo.svg"
            alt="Singularity Payments Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <span>Singularity Payments</span>
        </>
      ),
    },
  };
}
