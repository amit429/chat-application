import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const postDetails = (pic) => {
    setName(fname + " " + lname);
    setLoading(true);
    //handle undefined profile pic
    if (pic === undefined) {
      // Toast of chakra ui
      toast({
        title: "Profile Picture not uploaded",
        description: "Please upload a profile picture",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }

    if (
      pic.type === "image/jpg" ||
      pic.type === "image/jpeg" ||
      pic.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Chat App");
      data.append("cloud_name", "dtq1eg0o7");
      fetch("https://api.cloudinary.com/v1_1/dtq1eg0o7/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setprofilePic(data.url.toString()); //set url to the url of the uploaded image
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error uploading profile picture",
            description: "Please try again later",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select a valid image file",
        description: "Please upload a valid image file",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    var re = /\S+@\S+\.\S+/;
    var con = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!fname || !lname || !email || !password || !cpassword) {
      window.alert("Please fill all the fields");
    } else if (password != cpassword) {
      window.alert("Password and Confirm Password do not match");
    } else if (password.length < 8) {
      window.alert("Password must be atleast 8 characters long");
    }

    //validate email for correct format
    else if (!re.test(email)) {
      window.alert("Please enter a valid email address");
    }

    //validate password for atleast 1 uppercase, 1 lowercase, 1 number and 1 special character
    else if (!con.test(password)) {
      window.alert(
        "Password must contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character"
      );
    } else {
      try {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            profilePic,
          }),
        });
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
          setLoading(false);
        } else {
          console.log(data);
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

            setFname("");
            setLname("");
            setEmail("");
            setPassword("");
            setCpassword("");
            setprofilePic("");
          // put delay to show toast
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"2xl"} textAlign={"center"}>
              Sign up for an account
            </Heading>
          </Stack>
          <Box
            boxSize={{ base: "xs", sm: "sm", md: "lg" }}
            h="max-content !important"
            p={8}
            mt={-4}
          >
            <Stack spacing={4}>
              <HStack spacing={5}>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      required
                      onChange={(e) => {
                        setFname(e.target.value);
                      }}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      required
                      onChange={(e) => {
                        setLname(e.target.value);
                      }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => {
                      setCpassword(e.target.value);
                    }}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
