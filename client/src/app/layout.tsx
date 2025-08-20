import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { GameStateProvider } from "@/context/GameStateContext";
import { UserProvider } from "@/context/UserContext";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frisbeegolf-päiväkirja",
  description: "Pidä yllä nykyisen pelin kulkua ja katso pelattujen pelin historiaa",
};

// This controls the list of material symbols to be loaded from google fonts api
// When needing to use a symbol somewhere in the app, add it first here
// Only works when in alphabetical order so maybe sort them in href
const iconList = ["expand_content", "collapse_content", "menu", "add", "close", "person_remove", "person_add", "arrow_circle_up",
  "arrow_circle_down", "check_circle", "settings", "home", "history", "open_in_new", "edit", "account_circle", "strategy"];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await cookies()).get("token");

  let user = null;

  if (cookie) {
    const res = await fetch("http://localhost:8080/users/me", {
      headers: { Authorization: "Bearer " + cookie.value },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      user = { id: "", name: data.username }; // adjust if backend field is different
    }
  }

  console.log("this is user:", user);
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${iconList.sort().join(",")}&display=block`}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div id="root">
          <UserProvider initialUser={user}>
            <GameStateProvider>
              <Header />
              {children}
            </GameStateProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
