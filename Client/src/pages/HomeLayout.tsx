import { Grid } from "@chakra-ui/react";

const HomeLayout = () => {
  return (
    <Grid
      templateAreas={`"nav nav"
                      "main main"`}
      gridTemplateRows={"50px 1fr"}
      templateColumns={"1fr"}
      h="100vh"
    >
    </Grid>
  );
};

export default HomeLayout;