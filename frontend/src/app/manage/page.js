'use client';

import { Flex, Heading } from '@chakra-ui/react';
import NameChange from './components/NameChange';
import ShowSalary from './components/ShowSalary';
import Deposit from './components/Deposit';
import AddEmployee from './components/AddEmployee';
import RemoveEmployee from './components/RemoveEmployee';

export default function Manage() {
  return (
    <Flex direction='column' align='center' w='100%'>
      <Heading>Manage Company</Heading>
      <Flex direction='row' align='center' justify='space-evenly' w='100%'>
        <NameChange />
        <Flex direction='column'>
          <ShowSalary />
          <Deposit />
        </Flex>
      </Flex>
      <Flex direction='row' align='center' justify='space-evenly' w='100%'>
        <AddEmployee />
        <RemoveEmployee />
      </Flex>
    </Flex>
  );

}