import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text as ChakraText,
  MenuButton,
  Menu,
  MenuList,
  Flex,
  Avatar,
  MenuDivider,
  MenuItem,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  position,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { HiChevronDown } from "react-icons/hi";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { RxCross2 } from "react-icons/rx";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge,{Effect} from 'react-notification-badge'

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState();
  const [noUsersFound, setNoUsersFound] = useState(false);
  const { user,setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handleSearch = async (query) => {
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
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
    handleSearch(search);
  }, [search]);

  const accessChat = async(userId) => {
    try {
        setChatLoading(true)
        const config={
            headers:{
                "Content-type":"application/json",
                Authorization:`Bearer ${user.token}`,
            }
        }
        const {data}=await axios.post("/api/chat", {userId},config)
        if(!chats.find((c)=>c._id===data.id)) setChats([data,...chats])
        setSelectedChat(data)
        setChatLoading(false)
        clearSearch()
        onClose()
    } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    }
  };
  const clearSearch = () => {
    setSearch("");
    setSearchResult([]);
    setNoUsersFound(false);
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip >
          <Button variant="ghost" onClick={onOpen}>
            <IoIosSearch size="24px" />
            <ChakraText display={{ base: "node", md: "flex" }} px="4">
              Search User
            </ChakraText>
          </Button>
        </Tooltip>
        <ChakraText fontSize="2xl" fontFamily="Work sans">
          We-Chat
        </ChakraText>
        <Flex alignItems="center">
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
              />
              <IoNotifications size="22px" m={1} />
            </MenuButton>
            <MenuList
            pl={2}
            >{!notification.length && "No New Messages"}
            {notification.map((notif) =>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=>n !== notif))
              }}>
                {notif.chat.isGroupChat? `New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}</MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<HiChevronDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <InputGroup >
                <Input
                  placeholder="Search by name or email"
                  //mr={2}
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
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    if (!chats.some((chat) => chat.users.some((u) => u._id === user._id))) {
                      accessChat(user._id);
                    } else {
                      toast({
                        title: "User already in chat",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }}
                />
              ))
            )}
            {!loading && noUsersFound && (
              <ChakraText>No Users Found</ChakraText>
            )}
            {/* {ChatLoading && <Spinner ml="auto" display="flex"/>} */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
