import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import * as userApi from "../services/users";
import { useLoggedInUser } from "../hooks/useLoggInUser";

const schema = z.object({
  username: z
    .string({ invalid_type_error: "This field is required" })
    .min(3, { message: "min length is 3" })
    .max(255, { message: "maximum length is 255" })
    .trim(),
  email: z
    .string({ invalid_type_error: "This field is required" })
    .email({ message: "Enter a valid email" })
    .min(3, { message: "minimum length is 3" })
    .max(255, { message: "maximum length is 255" })
    .trim(),
  password: z
    .string({ invalid_type_error: "This filed is required" })
    .min(8, { message: "minimum length is 8" })
    .max(255, { message: "maximum length is 255" })
    .regex(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@!_&%*])/, {
      message:
        "Password should contain atleast 1 lowercase, 1 uppercase, 1 digit and 1 special character",
    })
    .trim(),
});

type formData = z.infer<typeof schema>;

interface signupProps {
  onSuccessfulSignup: () => void;
}

const Signup = ({ onSuccessfulSignup }: signupProps) => {
  const toast = useToast();
  const { setCurrentUser } = useLoggedInUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });

  const { colorMode } = useColorMode();

  const onSubmit: SubmitHandler<formData> = async (data) => {
    try {
      console.log(data);
      const response = await userApi.signUp(data);
      onSuccessfulSignup();
      console.log(response.data);
      // sessionStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(response.data);
      toast({
        position: "top-right",
        title: "Signup successful",
        description: `${response.message}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (er) {
      console.log(er);
      toast({
        position: "top-right",
        title: "Signup unsuccessful",
        description: `${er}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <GridItem area="main" zIndex="1" alignSelf="center" m="1rem">
      <Container
        bgColor={colorMode === "dark" ? "gray.700" : "#f1f1f1"}
        boxShadow={
          colorMode === "dark" ? "0px 0px 5px gray.100 " : "0px 0px 5px #969696"
        }
        p="20px"
        borderRadius="10px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username ? true : false}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              {...register("username")}
              id="username"
              placeholder="username"
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email ? true : false}>
            <FormLabel htmlFor="email">E-mail</FormLabel>
            <Input
              type="email"
              {...register("email")}
              id="email"
              placeholder="email"
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password ? true : false}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              {...register("password")}
              id="password"
              placeholder="password"
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button ml="50%" transform="translateX(-50%)" mt="20px" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </GridItem>
  );
};

export default Signup;
