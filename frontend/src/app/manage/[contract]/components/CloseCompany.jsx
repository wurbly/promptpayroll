import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Link,
  Button,
  Spinner
} from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import FormHeading from './FormHeading';

export default function CloseCompany({ contractAddress, abi }){
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "closeCompany"
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

  const handleClick = (evt) => {
    write();
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Close Company" />
      <Box mb={3}>
        <Text mb={3}>This function will close the company.</Text>
        <Text mb={3}>Any accrued salaries till this point will be automatically paid to all employees and any excess salaries deposited will be refunded to your account.</Text>
        <Text>This action is irreversible. CHECK BEFORE YOU PROCEED. </Text>
      </Box>
        <Button colorScheme="red" mb={3} width='100%' onClick={handleClick}>
          {isLoading ? <Spinner /> : "Close Company"}
        </Button>
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