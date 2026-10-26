import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "當爸媽這件事｜BeAParent",
  description: "從懷孕到告別，走一趟為人父母的島嶼旅程，看看你做得如何。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
