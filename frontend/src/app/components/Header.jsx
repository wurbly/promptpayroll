'use client';

import { Flex } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Brand from './Brand';
import Links from './Links';


export default function Header() {
  return (
    <Flex 
    minWidth="max-content" 
    alignItems="center" 
    justify="space-between"
    p={5}
    >
      <Brand />
      <Links />
      <Flex wrap='wrap'>
        <ConnectButton />
      </Flex>
    </Flex>
  )
}