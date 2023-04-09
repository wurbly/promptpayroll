import { Heading } from '@chakra-ui/react';

export default function FormHeading({ text }) {
  return (
    <Heading align="center" fontSize="2xl" my={3}>
      {text}
    </Heading>
  );
}