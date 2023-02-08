import { Box } from "@mui/material";
import MainLayout from "../components/mainLayout";

const HomePage = () => {
  return (
    <Box>Home</Box>
  );
};

HomePage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default HomePage;