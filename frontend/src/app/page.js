'use client';

import { Flex, Box, Heading, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import CreateNew from './components/CreateNew';

export default function Home() {
  
  return (
    <Flex direction="column" align="center">
      <Box width="50%" mb={5}>
        <Heading align="center" mb={5}>PromptPayroll</Heading>
        <Text mb={3}>Welcome to PromptPayroll.</Text>
        <Text mb={3}>A blockchain-enabled solution for your employees to get paid anytime they wish. No more payday loans with PromptPayroll!</Text>
        <Text mb={3}>To begin, create a contract for your Company by entering your Company name below and click the `Create Contract` button!</Text>
        <hr />
      </Box>
      <CreateNew />
      <Box width="50%">
        <Heading align="center">Find your company ↗️</Heading>
        <Box align="center" mb={3}>
          <Text>Already deployed a company contract or work for a company using PromptPayroll?</Text>
          <Text>Find your company from the `directory` tab to manage your company or claim your salary</Text>
          <Text align="center">
            or click <Link as={NextLink} href="/directory">✨here✨</Link>.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
