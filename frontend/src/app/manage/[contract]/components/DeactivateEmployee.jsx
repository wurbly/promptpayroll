import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Link,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Spinner
} from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import FormHeading from './FormHeading';

export default function DeactivateEmployee({ contractAddress, abi }){
  const [employeeId, setEmployeeId] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "deactivateEmployee",
    args: [employeeId]
  });

  const {
    data,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    error,
    write,
    status: txStatus
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

  const handleChange = (evt) => {
    setEmployeeId(evt.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setEmployeeId("");
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Deactivate Employee" />
      <Box mb={3}>
        <Text mb={3}>This deactivates the employee with the `EmployeeId`.</Text>
        <Text mb={3}>Use this function if you've entered the wrong address for an employee and want to deactivate the entry to add a new entry. </Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Employee ID:</FormLabel>
          <Input type='number' value={employeeId} onChange={handleChange}></Input>
          <FormHelperText color="#BBE1FA" mb={3}>This cannot be reversed. Please ensure that you have not deposited any salaries for this employee.</FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="red" mb={3} width='100%' p="auto">
          {isLoading ? <Spinner /> : "Remove Employee"}
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