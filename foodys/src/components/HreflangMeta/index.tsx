import { usePathname } from "next/navigation";
import Head from "next/head";
import { env } from "~/env.mjs";

export function HreflangMeta() {
  const pathname = usePathname();

  if (pathname === null) {
    return null;
  }

  return (
    <Head>
      <link
        rel="alternate"
        hrefLang="fr"
        href={env.NEXT_PUBLIC_SITE_URL + pathname}
      />
      <link
        rel="alternate"
        hrefLang="en"
        href={env.NEXT_PUBLIC_SITE_URL + "/en" + pathname}
      />
    </Head>
  );
}
