// pages/_app.js
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import React from 'react';

// Optionally, extend the default theme
const theme = extendTheme({
  // Add your theme customizations here
});

// Define global styles (if any)
const GlobalStyle = css`
  /* Your global styles here */
`;

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyle} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
