import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { BiShow, BiHide } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowpassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = (field) => {
    setShowpassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const submitHandler = async() => {
    setLoading(true)
    if(!name || !email || !password || !confirmPassword){
        toast({
            title: "Please Fill all the fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        setLoading(false)
        return
    }
    if(password!==confirmPassword){
        toast({
            title: "Password doesn't match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        setLoading(false)
        return
    }
    try {
        const config={
            headers:{
                "Content-Type":"application/json"
            },
        }
        const {data}= await axios.post("/api/user",{name,email,password,pic},config)
        toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        localStorage.setItem("userInfo",JSON.stringify(data))
        setLoading(false)
        navigate("/chats")
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast({
            title: "Error Occured!",
            description: message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        setLoading(false)
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "We-Chat");
      data.append("cloud_name", "dj6czrbj5");
      fetch("https://api.cloudinary.com/v1_1/dj6czrbj5/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString())
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showpassword.password ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleClick("password")}
            >
              {showpassword.password ? <BiHide /> : <BiShow />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showpassword.confirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleClick("confirmPassword")}
            >
              {showpassword.confirmPassword ? <BiHide /> : <BiShow />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
