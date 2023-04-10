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
  Spinner
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import FormHeading from "./FormHeading";

export default function AddEmployee({ contractAddress, abi }) {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState(0);
  const [salaryInWei, setSalaryInWei] = useState("");
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "addEmployee",
    args: [employeeAddress, salaryInWei],
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
    if (employeeSalary) {
      setSalaryInWei(ethers.utils.parseEther(employeeSalary));
    }
  }, [employeeSalary]);

  const handleChangeAddress = (evt) => {
    setEmployeeAddress(evt.target.value);
  };

  const handleChangeSalary = (evt) => {
    setEmployeeSalary(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setEmployeeAddress("");
    setEmployeeSalary(0);
    setSalaryInWei("");
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Add Employee" />
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Employee account address:</FormLabel>
          <Input
            type="text"
            value={employeeAddress}
            onChange={handleChangeAddress}
          />
          <FormHelperText color="#BBE1FA" mb={3}>
            Please ensure that you input the correct address. Incorrectly
            entered addresses will result in the address entered having full
            control of that employee&apos;s funds which we will be unable to recover.
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Monthly salary:</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={employeeSalary}
              onChange={handleChangeSalary}
            />
            <InputRightAddon children="ETH" color="#1B262C" />
          </InputGroup>
          <FormHelperText color="#BBE1FA" mb={3}>
            Please enter the correct salary in ETH. Changing the salary later
            will require a separate transaction, which will incur gas.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="green" mb={3} width="100%" p="auto">
          {isLoading ? <Spinner /> : "Add Employee"}
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
