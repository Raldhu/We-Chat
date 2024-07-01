import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from "@chakra-ui/react";

function ProfilePictureModal({ user, children, icon }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span onClick={onOpen}>{icon}</span>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="310px" w="360px">
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfilePictureModal;
