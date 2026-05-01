import "./globals.css";

export const metadata = {
  title: "Snake Arena",
  description: "A browser-only snake game with custom arenas and local leaderboards.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
