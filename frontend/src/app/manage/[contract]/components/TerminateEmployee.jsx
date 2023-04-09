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

export default function TerminateEmployee({ contractAddress, abi }){
  const [employeeId, setEmployeeId] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "terminateEmployee",
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
      <FormHeading text="Terminate Employee" />
      <Box mb={3}>
        <Text mb={3}>This terminates the employee with the `EmployeeId`.</Text>
        <Text mb={3}>Any accrued salaries this month will be automatically paid to the employee and any excess salaries deposited will be refunded to your account.</Text>
        <Text>If you've made an incorrect entry and haven't deposited any salaries, please use the "Deactivate Employee" option instead.</Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Employee ID:</FormLabel>
          <Input type='number' value={employeeId} onChange={handleChange}></Input>
          <FormHelperText color="#BBE1FA" mb={3}>This cannot be reversed. The employee will be paid the outstanding salary as of now and the balance will be refunded to your account.</FormHelperText>
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