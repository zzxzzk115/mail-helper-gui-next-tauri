import {
  Box,
  Container,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { open } from "@tauri-apps/api/shell";
import { BaseDirectory, exists, removeFile } from "@tauri-apps/api/fs";
import { useRouter } from "next/router";
import { useState } from "react";

const SettingsPage = () => {

  const router = useRouter();

  const [clearSettingsDialogOpen, setClearSettingsDialogOpen] = useState(false);

  const setClearSettingsDialogState = (open) => {
    setClearSettingsDialogOpen(open);
  };

  const handleClearSettingsDialogConfirm = async () => {
    await clearSetting();
    setClearSettingsDialogOpen(false);
  };

  const navigateToConfigurationSettingsPage = () => {
    router.push("/conf");
  };

  const clearSetting = async () => {
    let exist = await exists(".mhgn-conf.json", { dir: BaseDirectory.Home });
    if (exist) {
      await removeFile(".mhgn-conf.json", { dir: BaseDirectory.Home });
    }
    router.push("/home");
  }

  const openNewIssueWebPage = async () => {
    await open("https://github.com/zzxzzk115/mail-helper-gui-next-tauri/issues/new");
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
      <List component="nav">
        <Divider />
        <ListItemButton onClick={navigateToConfigurationSettingsPage}>
          <ListItemText primary="Configuration Settings" />
          <NavigateNextIcon />
        </ListItemButton>
        {/* <Divider />
        <ListItemButton>
          <ListItemText primary="Export Configuration" />
          <NavigateNextIcon />
        </ListItemButton> */}
        <Divider />
        <ListItemButton onClick={() => setClearSettingsDialogState(true)}>
          <ListItemText primary="Clear Settings" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={openNewIssueWebPage}>
          <ListItemText primary="Report Bugs" />
        </ListItemButton>
        <Divider />
      </List>

      <Dialog
        open={clearSettingsDialogOpen}
        onClose={() => setClearSettingsDialogState(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to clear settings?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will delete all the settings.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setClearSettingsDialogState(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClearSettingsDialogConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default SettingsPage;