import { NextUIProvider } from '@nextui-org/react';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}