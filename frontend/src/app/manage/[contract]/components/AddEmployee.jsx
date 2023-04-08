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

export default function AddEmployee(){
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [employeeSalary, setEmployeeSalary] = useState(0)
  // Need to handle conversion to wei from eth.

  const handleChange = (evt) => {
    setEmployeeAddress(evt.target.value);
  }

  return (
    <Box>
      <form>
        <FormControl>
          <FormLabel>Employee account address:</FormLabel>
          <Input type='text' value={employeeAddress} onChange={handleChange}></Input>
          <FormHelperText>
            Please check to ensure that the correct address is entered. 
            Incorrectly entered addresses will result in a loss of funds, which we will not be able to help recover.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Monthly salary:</FormLabel>
          <Input type='number' value={employeeAddress} onChange={handleChange}></Input>
          <FormHelperText>
            Please enter the correct salary in ETH. Changing the salary later will require a separate transaction, which will incur gas.
          </FormHelperText>
        </FormControl>
        <Button colorScheme='red'>Remove Employee</Button>
      </form>
    </Box>
  );
}