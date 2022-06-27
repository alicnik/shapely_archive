import type { AppProps } from 'next/app';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { AuthProvider } from '~/context';
import { Nav } from '~/components';
import { theme } from '~/lib';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Container>
          <Nav />
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
