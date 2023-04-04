'use client';

import { Flex, Spacer } from '@chakra-ui/react';

export default function Brand() {
  return (
    <Flex direction='column' justify='center' align='center'>
      <div>
        <img src="/favicon-32x32.png"></img>
      </div>
      <p>Prompt Payroll</p>
    </Flex>
  );
} 