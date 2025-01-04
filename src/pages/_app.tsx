import Providers from "@/components/Providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { ReactNode } from "react";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);
  return <Providers>{getLayout(<Component {...pageProps} />)}</Providers>;
}
