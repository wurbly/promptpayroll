import { Flex } from '@chakra-ui/react';
import ContractCard from './ContractCard';

export default function ShowContracts() {
  return (
    <Flex justify='evenly'>
      <ContractCard header='Demo 1' body='Test card body 1' footer='Test card footer 1'/>
      <ContractCard header='Demo 1' body='Test card body 1' footer='Test card footer 1'/>
      <ContractCard header='Demo 1' body='Test card body 1' footer='Test card footer 1'/>
    </Flex>
  )
}