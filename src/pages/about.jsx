import { Box } from "@mui/material";
import MainLayout from "../components/mainLayout";

const AboutPage = () => {
  return (
    <Box>About</Box>
  );
};

AboutPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default AboutPage;