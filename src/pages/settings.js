import { Box } from "@mui/material";
import MainLayout from "../components/MainLayout";

const SettingsPage = () => {
  return (
    <Box>Settings</Box>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default SettingsPage;