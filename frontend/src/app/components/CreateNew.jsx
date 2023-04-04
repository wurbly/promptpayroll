'use client';

import { useState } from 'react';
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

  const handleChange = (evt) => {
    setCompanyName(evt.target.value);
  }

  return (
    <form>
      <FormControl isRequired>
        <FormLabel>Company Name:</FormLabel>
        <Input type='text' value={companyName} onChange={handleChange}/>
        <FormHelperText>This will require gas to change after initial set-up.</FormHelperText>
      </FormControl>
      <Button colorScheme='red'>Create Contract</Button>
    </form>
  )
  
}