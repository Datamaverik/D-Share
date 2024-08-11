import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import * as UserApi from "../services/users";
import ColorModeSwithc from "./ColorModeSwithc";
import { FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoggedInUser } from "../hooks/useLoggInUser";



const Navbar = () => {
  const { currentUser,setCurrentUser } = useLoggedInUser();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/api/login");
    try {
      const response = await UserApi.logout();
      setCurrentUser(null);
      toast({
        position: "top-right",
        title: "Logout successful",
        description: `${response.message}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (er) {
      console.log(er);
      toast({
        position: "top-right",
        title: "Logout unsuccessful",
        description: `${er}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Flex
      p={3}
      bgGradient="linear(to-l,blue.700,blue.400)"
      justifyContent="space-between"
      boxShadow="md"
    >
      {/* add brand image here */}
      <Image mr={3} src={""} boxSize="60px"></Image>
      <HStack>
        {currentUser ? (
          <VStack>
            <HStack>
              <FaUser />
              <Text fontWeight="bold" zIndex="1">
                {currentUser?.username}
              </Text>
            </HStack>
            <Button onClick={handleLogout}>Logout</Button>
          </VStack>
        ) : (
          <HStack>
            <NavLink to="/api/signup">Signup</NavLink>
            <NavLink to="/api/login">Login</NavLink>
          </HStack>
        )}
        <ColorModeSwithc />
      </HStack>
    </Flex>
  );
};

export default Navbar;
