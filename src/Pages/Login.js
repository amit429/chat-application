import React from "react";
import { useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Center,
  InputGroup,
  InputRightElement,
  Checkbox,
  Link,
  useToast,
} from "@chakra-ui/react";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (email === "" || password === "") {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    } else {
      try {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await res.json();
        if (res.status === 401 || !data) {
          console.log("Invalid Credentials");
          toast({
            title: "Invalid Credentials",
            description: "Please check your email and password",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setTimeout(() => {
            setLoading(false);
            setEmail("");
            setPassword("");
          }, 3000);
        } else {
          console.log("Login Successfull");
          toast({
            title: "Login Successfull",
            description: "You are now logged in",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setTimeout(() => {
            setLoading(false);
            window.location.href = "/chats";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClick = () => setShow(!show);
  return (
    <>
      <Container  maxW="4xl" p={{ base: 5, md: 5 }}>
        <Center>
          <Stack spacing={4}>
            <Stack align="center">
              <Heading fontSize="2xl">Sign in to your account</Heading>
            </Stack>
            <VStack
              mt={-3}
              as="form"
              boxSize={{ base: "xs", sm: "sm", md: "lg" }}
              h="max-content !important"
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              //boxShadow="lg"
              p={{ base: 5, sm: 10 }}
              spacing={8}
            >
              <VStack spacing={4} w="100%">
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    rounded="md"
                    type="email"
                    value={email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      rounded="md"
                      type={show ? "text" : "password"}
                      value={password}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        rounded="md"
                        bg={useColorModeValue("gray.300", "gray.700")}
                        _hover={{
                          bg: useColorModeValue("gray.400", "gray.800"),
                        }}
                        onClick={handleClick}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </VStack>
              <VStack w="100%">
                <Stack direction="row" justify="space-between" w="100%">
                  <Checkbox colorScheme="green" size="md">
                    Remember me
                  </Checkbox>
                  <Link fontSize={{ base: "md", sm: "md" }}>
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  bg="blue.500"
                  color="white"
                  _hover={{
                    bg: "green.500",
                  }}
                  rounded="md"
                  w="100%"
                  mt={4}
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Sign in
                </Button>
              </VStack>
            </VStack>
          </Stack>
        </Center>
      </Container>
    </>
  );
}
