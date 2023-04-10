import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
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

export default function ChangeAddress({ contractAddress, abi }) {
  const [newAddress, setNewAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "changeAddress",
    args: [newAddress]
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
    setNewAddress(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setNewAddress("");
  };

  return (
    <Flex direction="column" width="100%" bgColor="#0F4C75" p={3}>
      <Heading align="center" fontSize="2xl" my={3}>
        Change address
      </Heading>
      <Text>Use this form to change your address.</Text>
      <Text mb={3}>
        (You must be signed in using your registered address on the contract.)
      </Text>
      <Text mb={3}>Note: This transaction will incur gas.</Text>
      <Text mb={3}>
        Upon successful confirmation, you will only be able to access this page
        using the new address.
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel mt={3}>New Address</FormLabel>
          <Input type="text" value={newAddress} onChange={handleChange} />
          <FormHelperText color="#BBE1FA" mb={3}>
            Please check that you have input the correct address as the new
            address will have access to all your salaries accrued till date and
            will be automatically sent your future salaries.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="orange" width="100%">
          {!isLoading && "Change Address"}
          {isLoading && <Spinner />}
        </Button>
      </form>
      <Box>
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
