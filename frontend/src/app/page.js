'use client';

import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import CreateNew from './components/CreateNew';
import ShowContracts from './components/ShowContracts';

export default function Home() {
  
  return (
    <Flex direction="column" align="center">
      <Box maxWidth="50%">
        <Heading align="center" mb={5}>PromptPayroll</Heading>
        <Text>Welcome to PromptPayroll.</Text>
        <Text>We simplify payroll transactions by allowing employees to claim their accrued salaries on demand in the middle of the month. No more payday loans or employer advances!</Text>
        <Text>To start, simply deploy a new payroll contract for your company below.</Text>
      </Box>
      <Heading>Set up a new payroll contract</Heading>
      <CreateNew />
      <Heading>Find your company</Heading>
      <Box>
        Already have a company? Find your company below!
      </Box>
      <ShowContracts />
    </Flex>
  );
}
