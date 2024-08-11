import { GridItem } from "@chakra-ui/react";
import Lobby from "./Lobby";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <>
      <GridItem area="side">
        <Sidebar />
      </GridItem>
      <GridItem area="main">
        <Lobby />
      </GridItem>
    </>
  );
};

export default Dashboard;
