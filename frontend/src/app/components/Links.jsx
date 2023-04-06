import { Flex, Box, Spacer } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/next-js';


export default function Links() {
  return (
    <Flex >
      <Link as={NextLink} href='/' mr={2}>home</Link>
      <Link as={NextLink} href='/manage' mx={2}>manage</Link>
      <Link as={NextLink} href='/withdraw' ml={2}>withdraw</Link>
    </Flex>
  );
}
