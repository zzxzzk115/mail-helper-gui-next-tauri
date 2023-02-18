import { Box, Container, Stack, Typography } from "@mui/material";
import MainLayout from "../components/MainLayout";
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsPage = () => {
  return (
    <Container>
      <Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          marginBottom={3}>
          <SettingsIcon color="primary" fontSize="large" />
          <Typography variant="h4" color="primary">Settings</Typography>
        </Stack>
      </Box>
    </Container>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default SettingsPage;