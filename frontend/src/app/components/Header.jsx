import { Flex } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Brand from './Brand';
import Links from './Links';

export default function Header() {
  return (
    <Flex
      direction="column"
      width="100%"
      align="center"
      justify="center"
      bgColor="#0F4C75"
    >
      <Flex 
        width="100%"
        align="center" 
        justify="space-between"
        p={5}
      >
        <Brand />
        <ConnectButton />
      </Flex>
      <Links />
    </Flex>
  );
}