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

export default function RemoveEmployee(){
  const [employeeId, setEmployeeId] = useState(0);

  const handleChange = (evt) => {
    setEmployeeId(evt.target.value);
  }


  return (
    <Box>
      <form>
        <FormControl>
          <FormLabel>Employee ID:</FormLabel>
          <Input type='number' value={employeeId} onChange={handleChange}></Input>
          <FormHelperText>This cannot be reversed. The employee will be paid the outstanding salary as of now and the balance will be refunded to your account.</FormHelperText>
        </FormControl>
        <Button colorScheme='red'>Remove Employee</Button>
      </form>
    </Box>
  );
}