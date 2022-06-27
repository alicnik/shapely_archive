import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';

type LinkProps = NextLinkProps & ChakraLinkProps;

export function Link({ href, children, ...rest }: React.PropsWithChildren<LinkProps>) {
  return (
    <NextLink href={href} passHref>
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NextLink>
  );
}
