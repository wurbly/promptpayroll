import { Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';


export default function Links() {
  return (
    <Flex >
      <Link as={NextLink} href='/' mr={2}>home</Link>
      <Link as={NextLink} href='/directory' mx={2}>directory</Link>
    </Flex>
  );
}
