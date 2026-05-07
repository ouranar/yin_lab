import { notFound } from "next/navigation";
import { isSiteLocale, siteLocales } from "@/lib/i18n";

export function generateStaticParams() {
  return siteLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  return <div lang={locale}>{children}</div>;
}
