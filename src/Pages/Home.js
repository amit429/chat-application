import { 
    Box, 
    Container, 
    Heading, 
    Text , 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Input,
    Button
    
} from "@chakra-ui/react";
import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useState , useEffect } from "react";

export default function Home() {

  return (
    <>
      <Container maxW="xl" centerContent m={"auto"}>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg="green.200"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          textAlign={"center"}
        >
          <Text fontSize="4xl" fontFamily="initial">
            Inter-React
          </Text>
        </Box>

        <Box boxShadow={"md"} bg="white.100" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
        </Box>
      </Container>
    </>
  );
}
