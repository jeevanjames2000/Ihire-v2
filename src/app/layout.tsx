"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import store, { persistor } from "../../src/store/store";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
