import {
  Button,
  Container,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from "@chakra-ui/react";
import { useLoggedInUser } from "../hooks/useLoggInUser";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { currentUser } = useLoggedInUser();
  const [email, setEmail] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRoomJoin = () => {
    socket?.emit("room:join", { email, room: roomId });
    onClose(); // Close the dialog after emitting
  };

  const handleJoinRoom = useCallback(
    (data: { email: string; room: string }) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (currentUser) setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    socket?.on("room:join", (data) => {
      handleJoinRoom(data);
      // console.log("Data from backend", data);
    });
    return () => {
      socket?.off("room:join");
    };
  }, [handleJoinRoom, socket]);

  return (
    <Container>
      <Heading m={5}>Lobby Screen</Heading>
      <Button colorScheme="teal" onClick={onOpen}>
        Join Meeting
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join a Meeting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleRoomJoin}>
              Join
            </Button>
            <Button variant="outline" ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Lobby;
