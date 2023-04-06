'use client';

import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useProvider, useSignMessage, useAccount } from 'wagmi'

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button
} from '@chakra-ui/react'

export default function CreateNew() {
  const [companyName, setCompanyName] = useState("");
  
  const provider = useProvider();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'You are signing in to Prompt Payroll. Sign the message to confirm.'
  });
  const { address, isConnecting, isDisconnected } = useAccount();

  const handleChange = (evt) => {
    setCompanyName(evt.target.value);
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const network = await provider.getNetwork();
    console.log(network);
    const response = await signMessage();
    console.log(response);
    console.log("The connected address is: ", address);
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Company Name:</FormLabel>
          <Input type="text" value={companyName} onChange={handleChange}/>
          <FormHelperText>This will require gas to change after initial set-up.</FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="red">Create Contract</Button>
      </form>
    </Box>
  );
}