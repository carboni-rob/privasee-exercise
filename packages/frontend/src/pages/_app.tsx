import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Auth0UsersProvider } from "@/contexts/Auth0UsersContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Auth0UsersProvider>
        <Component {...pageProps} />
      </Auth0UsersProvider>
    </UserProvider>
  );
}
