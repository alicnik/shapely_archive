import { Center, Flex, Spinner, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import * as React from 'react';
import { useAuth } from '~/context';

const Login: NextPage = () => {
  const { login } = useAuth();

  React.useEffect(() => {
    login();
  }, [login]);

  return (
    <Center mt={8}>
      <Flex direction="column" align="center" gap={8}>
        <Spinner size="xl" />
        <Text>Signing in...</Text>
      </Flex>
    </Center>
  );
};

export default Login;
