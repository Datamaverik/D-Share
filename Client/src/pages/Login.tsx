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
  InputGroup,
  InputRightElement,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import * as userApi from "../services/users";
import { FaGithub } from "react-icons/fa6";
// import { FaGoogle } from "react-icons/fa6";
import { useLoggedInUser } from "../hooks/useLoggInUser";
import { useEffect, useState } from "react";

const schema = z.object({
  username: z
    .string({ invalid_type_error: "This field is required" })
    .min(3, { message: "min length is 3" })
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

interface loginProps {
  onSuccessfulLogin: () => void;
}

const GITHUB_CLIENT_ID = "Ov23liqCybNboghZLnRs";
// const GOOGLE_CLIENT_ID =
// "527880605810-penqdp4ejhfdc8mp53ddoh59samleqai.apps.googleusercontent.com";

const Login = ({ onSuccessfulLogin }: loginProps) => {
  const toast = useToast();
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);
  const { setCurrentUser } = useLoggedInUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });

  const { colorMode } = useColorMode();

  const loginWithGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID
    );
  };

  // const loginWithGoogle = () => {
  // window.location.assign(
  // "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
  // GOOGLE_CLIENT_ID
  // );
  // };

  const onSubmit: SubmitHandler<formData> = async (data) => {
    try {
      const response = await userApi.login(data);
      onSuccessfulLogin();
      setCurrentUser(response.user);
      toast({
        position: "top-right",
        title: "Login successful",
        description: `${response.message}`,
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    } catch (er) {
      console.log(er);
      toast({
        position: "top-right",
        title: "Login unsuccessful",
        description: `${er}`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);
    const GithubCallback = async () => {
      try {
        const response = await userApi.authWithGithub(codeParam!);
        console.log(response.user);
        onSuccessfulLogin();
        setCurrentUser(response.user);
        toast({
          position: "top-right",
          title: "Login successful",
          description: `${response.message}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      } catch (er) {
        console.log(er);
      }
    };
    GithubCallback();
  }, []);

  return (
    <GridItem area="main" zIndex="1" alignSelf="center" m="1rem">
      <Container
        bgColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        p="20px"
        borderRadius="10px"
      >
        <Button
          onClick={loginWithGithub}
          size="lg"
          ml="50%"
          transform="translateX(-50%)"
          leftIcon={<FaGithub />}
          colorScheme="teal"
          variant="ghost"
        >
          Log in with Github
        </Button>
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
          <FormControl isInvalid={errors.password ? true : false}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                {...register("password")}
                id="password"
                placeholder="password"
              />
              <InputRightElement>
                <Button h="2rem" minW="4rem" size="sm" mr={8} padding={3} onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
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

export default Login;
