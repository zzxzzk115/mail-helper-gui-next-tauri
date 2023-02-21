import {
  Box,
  Container,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { open } from "@tauri-apps/api/shell";
import { BaseDirectory, exists, removeFile } from "@tauri-apps/api/fs";
import { useRouter } from "next/router";

const SettingsPage = () => {

  const router = useRouter();

  const clearSetting = async () => {
    let exist = await exists(".mhgn-conf.json", { dir: BaseDirectory.Home });
    if (exist) {
      await removeFile(".mhgn-conf.json", { dir: BaseDirectory.Home });
    }
    router.push('/home');
  }

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
      <List component="nav" aria-label="mailbox folders">
        <Divider />
        <ListItemButton>
          <ListItemText primary="Configuration Settings" />
          <NavigateNextIcon />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Export Configuration" />
          <NavigateNextIcon />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={clearSetting}>
          <ListItemText primary="Clear Settings" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => open("https://github.com/zzxzzk115/mail-helper-gui-next-tauri/issues/new")}>
          <ListItemText primary="Report Bugs" />
        </ListItemButton>
        <Divider />
      </List>
    </Container>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default SettingsPage;