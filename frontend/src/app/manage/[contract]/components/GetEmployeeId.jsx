import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import FormHeading from './FormHeading';

export default function ShowSalary({ contractAddress, abi }) {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const { data } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getEmployeeId",
    args: [employeeAddress],
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setEmployeeId(String(data));
    } else {
      setEmployeeId("Please enter address")
    }
  }, [data]);

  const handleChange = (evt) => {
    setEmployeeAddress(evt.target.value);
  }

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Get Employee Id from Address" /> 
      <Box mb={3}>
        <FormControl isRequired>
          <FormLabel>Enter address: </FormLabel>
          <Input
            type="text"
            value={employeeAddress}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Box>
        <Text>Employee ID: {employeeId} </Text>
      </Box>
    </Flex>
  );
}