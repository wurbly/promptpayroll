import { Flex, Box, Text } from '@chakra-ui/react';
import Links from './Links';

export default function Header() {

  return (
    <Flex 
    direction="column"
    align="center"
    justify="center" 
    bgColor="#3282B8">
      <Box>
      <Text>😶 made with love 😶</Text>
      </Box>
      <Box>
        <Links /> 
      </Box>
    </Flex>
  );
}