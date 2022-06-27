import {
  useColorMode,
  IconButton,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '~/components';
import { useAuth } from '~/context';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleCreatePoll = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked');
  };

  return (
    <Flex as="nav" align="center" py={4} gap={4}>
      <Link href="/">Home</Link>
      {user && (
        <NextLink href="/create" passHref>
          <Button size="md" colorScheme="blue" onClick={handleCreatePoll}>
            Create poll
          </Button>
        </NextLink>
      )}
      {user ? (
        <Menu>
          <MenuButton
            as={Avatar}
            ml="auto"
            cursor="pointer"
            size="sm"
            name={user.user_metadata.name}
            src={user.user_metadata.avatar_url}
          />
          <MenuList>
            <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
            <MenuItem onClick={logout}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Link ml="auto" href="/login">
          Login
        </Link>
      )}
      <IconButton aria-label="Toggle dark mode" onClick={toggleColorMode}>
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </Flex>
  );
}
