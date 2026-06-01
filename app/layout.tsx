import type { Metadata } from "next";
import { createFontClassName } from "@/components/create/create-fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppFrame - App Store Screenshot Generator",
  description:
    "Create beautiful, launch-ready App Store screenshots in minutes with AppFrame.",
  icons: {
    icon: "/AppFrames-logo1.PNG",
    shortcut: "/AppFrames-logo1.PNG",
    apple: "/AppFrames-logo1.PNG"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={createFontClassName}>{children}</body>
    </html>
  );
}
