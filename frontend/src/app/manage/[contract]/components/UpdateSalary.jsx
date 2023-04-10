import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Link,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
  FormHelperText,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import FormHeading from "./FormHeading";

export default function UpdateSalary({ contractAddress, abi }) {
  const [employeeId, setEmployeeId] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [currentSalaryInWei, setCurrentSalaryInWei] = useState("");
  const [newSalary, setNewSalary] = useState(0);
  const [salaryInWei, setSalaryInWei] = useState("");
  const [txValue, setTxValue] = useState("");
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { data: employeeAddressData } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "employeeAddresses",
    args: [employeeId],
    watch: true,
  });

  const { data: currentEmployeeData } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "employees",
    args: [employeeAddressData],
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "updateSalary",
    args: [employeeId, salaryInWei],
    overrides: {
      value: txValue,
    },
  });

  const {
    data,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    error,
    write,
    status: txStatus,
  } = useContractWrite(config);

  useEffect(() => {
    if (isIdle) {
      setStatusMessage("Waiting for transaction");
    } else if (isLoading) {
      setStatusMessage("Confirm transaction on your wallet");
    } else if (isSuccess) {
      setStatusMessage("Transaction sent!");
    } else if (isError) {
      setStatusMessage(`Error: ${error.message}`);
    }
  }, [txStatus]);

  useEffect(() => {
    if (data) {
      setTxHash(data.hash);
    }
  }, [data]);

  useEffect(() => {
    if (employeeAddressData) {
      setCurrentSalary(
        String(ethers.utils.formatEther(currentEmployeeData[2]))
      );
    }
  }, [employeeId]);

  useEffect(() => {
    if (currentSalary) {
      setCurrentSalaryInWei(ethers.utils.parseEther(currentSalary));
    }
  }, [currentSalary]);

  useEffect(() => {
    if (newSalary) {
      setSalaryInWei(ethers.utils.parseEther(newSalary));
    }
  }, [newSalary]);

  useEffect(() => {
    if (salaryInWei) {
      if (salaryInWei - currentSalaryInWei > 0) {
        setTxValue((salaryInWei - currentSalaryInWei).toString());
      } else {
        setTxValue(0);
      }
    }
  }, [salaryInWei]);

  const handleChangeEmployeeId = (evt) => {
    setEmployeeId(evt.target.value);
  };

  const handleChangeSalary = (evt) => {
    setNewSalary(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setEmployeeId("");
    setCurrentSalary("");
    setNewSalary("");
    setCurrentSalaryInWei("");
    setSalaryInWei("");
    setTxValue("");
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Update Salary" />
      <Box align="start" border="1px solid #BBE1FA" p={1} mb={3}>
        <Text>Current Salary: {currentSalary} ETH</Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Employee ID: </FormLabel>
          <Input
            type="number"
            value={employeeId}
            onChange={handleChangeEmployeeId}
          />
          <FormHelperText color="#BBE1FA" mb={3}>
            Please ensure you enter the correct ID. To check, use the `Get
            Employee Id from Address` form to confirm an employee's id!
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>New monthly salary:</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={newSalary}
              onChange={handleChangeSalary}
            />
            <InputRightAddon children="ETH" color="#1B262C" />
          </InputGroup>
          <FormHelperText color="#BBE1FA" mb={3}>
            Please enter the updated salary. If salary is increased, you will be
            required to top up the difference in salary for the current period.
            If salary is decreased, you will be refunded the difference in
            salary for the current period.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="green" mb={3} width="100%" p="auto">
          {isLoading ? <Spinner /> : "Update Salary"}
        </Button>
      </form>
      <Box width="100%" bgColor="#0F4C75" p={3} mb={3}>
        <Text>{statusMessage}</Text>
        {txHash && (
          <Text>
            Txhash:&nbsp;
            <Link href={`https://sepolia.etherscan.io/tx/${txHash}`} isExternal>
              {txHash}
            </Link>
          </Text>
        )}
      </Box>
    </Flex>
  );
}
