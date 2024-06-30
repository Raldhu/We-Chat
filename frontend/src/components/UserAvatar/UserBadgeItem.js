import React from 'react'
import { Box } from '@chakra-ui/react'
import { RxCross2 } from "react-icons/rx";

function UserBadgeItem({user,handleFunction}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    backgroundColor="purple"
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    display="flex"
    alignItems="center"
    >
        <Box mr={1}>{user.name}</Box>
        <RxCross2 />
    </Box>
  )
}

export default UserBadgeItem