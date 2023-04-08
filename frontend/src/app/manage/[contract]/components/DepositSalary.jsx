import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  Text
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractRead } from "wagmi";
import DepositForm from './DepositForm';

export default function ShowSalary({ contractAddress, abi }) {
  const [salaries, setSalaries] = useState(0);

  const { data } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "totalSalaries",
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setSalaries(ethers.utils.formatEther(data));
    }
  }, [data]);

  return (
    <Flex direction="column" width="48%" bgColor="#0F4C75" p={3}>
      <Heading align="center" fontSize="2xl" my={3}>
        Deposit Salaries
      </Heading>
      <Box>
        <Text>Total Salaries: {salaries} ETH</Text>
      </Box>
      <DepositForm contractAddress={contractAddress} abi={abi} salaries={salaries}/>
    </Flex>
  );
}
