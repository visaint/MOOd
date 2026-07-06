import type { Metadata } from "next";
import "./globals.css";
import { MoodProvider } from "@/lib/MoodContext";
import { DarkModeProvider } from "@/lib/DarkModeContext";

export const metadata: Metadata = {
  title: "MOOd — Daily Mood Feed",
  description: "A dreamy mood-sharing feed — today's themes, yesterday's moos.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=localStorage.getItem("mood_dark_mode");if(d==="true"||(d===null&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <DarkModeProvider>
          <MoodProvider>{children}</MoodProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
