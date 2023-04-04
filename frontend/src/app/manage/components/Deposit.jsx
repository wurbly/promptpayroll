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

export default function Deposit() {
  const [monthDays, setMonthDays] = useState("");

  const handleChange = (evt) => {
    setMonthDays(evt.target.value);
  }

  return (
    <Box>
      <form>
        <FormControl isRequired>
        <FormLabel>Days this Month</FormLabel>
          <Input type='text' value={monthDays} onChange={handleChange}/>
          <FormHelperText>Confirm that the total salaries are correkt.</FormHelperText>
        </FormControl>
        <Button colorScheme='blue'>Deposit Salaries</Button>
      </form>
    </Box>
  );
}