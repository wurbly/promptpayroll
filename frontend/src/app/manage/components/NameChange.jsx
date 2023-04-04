'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button
} from '@chakra-ui/react'

export default function NameChange() {
  const [companyName, setCompanyName] = useState("");

  const handleChange = (evt) => {
    setCompanyName(evt.target.value);
  }

  return (
    <Box>
      <form>
        <FormControl isRequired>
          <FormLabel>New Company Name</FormLabel>
          <Input type='text' value={companyName} onChange={handleChange}/>
          <FormHelperText>This transaction will cost gas. Confirm transaction on your wallet.</FormHelperText>
        </FormControl>
        <Button colorScheme='blue'>Confirm change</Button>
      </form>
    </Box>
  );
}