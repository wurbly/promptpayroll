'use client';

import { Flex, Box, Heading } from '@chakra-ui/react';
import CreateNew from './components/CreateNew';
import ShowContracts from './components/ShowContracts';

export default function Home() {
  return (
    <Flex direction='column' align='center'>
      <Box>
        Setting up a Payroll contract for your company is easy. Just enter your company name into the field below, and hit submit.
        A contract will be automatically deployed for you to manage your employee payrolls.
      </Box>
      <Heading>Set up a new payroll contract</Heading>
      <CreateNew />
      <Heading>Find your company</Heading>
      <Box>
        Already have a company? Find your company below!
      </Box>
      <ShowContracts />
    </Flex>
  )
}
