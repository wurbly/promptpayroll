'use client';

import { Flex } from '@chakra-ui/react';
import Links from './Links';

export default function Header() {
  return (
    <Flex justify="center">
      <Links />
    </Flex>
  )
}