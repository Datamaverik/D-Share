import {
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ColorModeSwithc = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <HStack>
      <IconButton
        size={"sm"}
        icon={colorMode === "light" ? <MdDarkMode /> : <MdLightMode />}
        aria-label={"Change Color Theme"}
        onClick={toggleColorMode}
      />
      <Text whiteSpace="nowrap">
        {colorMode === "light" ? "Dark" : "Light"}
      </Text>
    </HStack>
  );
};

export default ColorModeSwithc;
