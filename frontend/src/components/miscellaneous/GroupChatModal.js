import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Text as ChakraText,
  Box
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { RxCross2 } from "react-icons/rx";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noUsersFound, setNoUsersFound] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      setNoUsersFound(false);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
      setNoUsersFound(data.length === 0);
    } catch (error) {
      setLoading(false);
      setNoUsersFound(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      setSearchResult([]);
    }
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setSearchResult([]);
    setNoUsersFound(false);
  };

  const handleSubmit = async() => {
    if(!groupChatName || selectedUsers.length===0){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        duration: 5000,
        isClosable: true,
        position:"top"
      })
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.post("/api/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=> u._id))
      },config)
      setChats([data,...chats])
      onClose()
      toast({
        title:"New Group Created",
        status:"success",
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
      setSelectedUsers([])
    } catch (error) {
      toast({
        title:"Failed to Create the Chat!",
        description: error.response.data,
        status:"error",
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
    }
  };
  const handleDelete=(delUser)=>{
    setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==delUser._id))
  };

  const handleGroup = (userToAdd) => {
    if(selectedUsers.some((u) => u._id === userToAdd._id)){
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"top"
      })
      return;
    }
    setSelectedUsers([...selectedUsers,userToAdd])
    clearSearch()
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                
              />
            </FormControl>
            <FormControl>
            <InputGroup >
              <Input
                placeholder="Add Users eg: Khvicha, Kvaratskhelia, Aubameyang"
                mb={1}
                //onChange={(e)=>handleSearch(e.target.value)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                  <InputRightElement>
                    {/* <Button mr={2} size="sm" onClick={clearSearch}>
                      <RxCross2 />
                    </Button> */}
                      <RxCross2 size="20px" onClick={clearSearch} cursor='pointer' />
                  </InputRightElement>
                )}
                </InputGroup>
            </FormControl>
            <Box w="100%"
            display="flex"
            flexWrap="wrap"
            >
            {selectedUsers.map((u)=>(
              <UserBadgeItem key={user._id} user={u} handleFunction={()=>handleDelete(u)} />
            ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            {!loading && noUsersFound && (
              <ChakraText>No Users Found</ChakraText>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default GroupChatModal;
