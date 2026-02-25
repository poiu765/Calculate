import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arithmetic Automation Trainer",
  description: "Fast, accurate arithmetic practice with spaced repetition.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black" style={{ backgroundColor: "#FFFFFF", color: "#000000" }}>
        <div className="min-h-screen">
          <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
