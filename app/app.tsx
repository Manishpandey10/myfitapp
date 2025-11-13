import "./globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen">
      <header className="p-4 border-b dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">AI Fitness Assistant</h1>
          <div>
            <button
              className="mr-2"
              onClick={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
            >
              {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>
        </div>
      </header>
      <Component {...pageProps} />
    </div>
  );
}
