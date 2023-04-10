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
  Spinner,
} from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import FormHeading from "./FormHeading";

export default function NameChange({ contractAddress, abi }) {
  const [companyName, setCompanyName] = useState("");
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "changeCompanyName",
    args: [companyName],
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

  const handleChange = (evt) => {
    setCompanyName(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setCompanyName("");
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <FormHeading text="Change Company Name" />
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>New Company Name</FormLabel>
          <Input type="text" value={companyName} onChange={handleChange} />
          <FormHelperText color="#BBE1FA" mb={3}>
            This transaction will cost gas.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="red" mb={3} width="100%" p="auto">
          {isLoading ? <Spinner /> : "Change Name"}
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
