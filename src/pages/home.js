import { Container, Stack, Button, Typography, Link, Alert, AlertTitle, Box, IconButton, Snackbar } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import QrScanner from 'qr-scanner';
import { exists, BaseDirectory, readTextFile, copyFile, writeTextFile } from "@tauri-apps/api/fs";
import { open } from '@tauri-apps/api/dialog';

import MainLayout from "../components/MainLayout";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import QrCodeIcon from '@mui/icons-material/QrCode';
import FolderIcon from '@mui/icons-material/Folder';
import HomeImport from "../components/HomeImport";
import HomeEmailAction from "../components/HomeEmailAction";

const HomePage = () => {

  const router = useRouter();
  const [existConfig, setExistConfig] = useState(null);
  const hiddenFileInput4QrCode = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [serverity, setServerity] = useState("info");
  const [configJson, setConfigJson] = useState(null);

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const loadConfiguration = async () => {
    setExistConfig(await exists(".mhgn-conf.json", { dir: BaseDirectory.Home }));
  };

  const showSnackbar = (message, serverity) => {
    setSnackbarMessage(message);
    setServerity(serverity);
    setSnackbarOpen(true);
  };

  const importFromJson = (json) => {
    // Check validation
    if (!json.gophish_api_key) {
      showSnackbar("Gophish API_KEY not found in conf.json", "error");
      return false;
    }
    setConfigJson(json);
    return true;
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSendEmail = async () => {

  }

  const onOpenFileBrowser4Json = async () => {
    const selected = await open({
      filters: [{
        name: "JSON",
        extensions: ["json"]
      }]
    });
    if (selected) {
      const configFile = await readTextFile(selected);
      var json = JSON.parse(configFile);
      var result = importFromJson(json);
      if (!result) {
        return;
      }

      // Copy to AppConfig
      await copyFile(selected, ".mhgn-conf.json", { dir: BaseDirectory.Home });
      setExistConfig(true);
      showSnackbar("Successfully imported configuration", "success");
    }
  }

  const onOpenFileBrowser4HtmlTemplate = async () => {
    const selected = await open({
      filters: [{
        name: "HTML",
        extensions: ["html", "htm", "txt"]
      }]
    });
    if (selected) {
      const html = await readTextFile(selected);

    }
  }

  const onOpenFileBrowser4HtmlTemplateConfig = async () => {
    const selected = await open({
      filters: [{
        name: "TEXT",
        extensions: ["txt"]
      }]
    });
    if (selected) {
      const htmlConfig = await readTextFile(selected);

    }
  }

  const onFileInput4QrCodeChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.search("image/") === -1) {
        showSnackbar("Not an image!", "error");
        return;
      }
      QrScanner.scanImage(event.target.files[0]).then(async (result) => {
        var json = JSON.parse(result);
        var res = importFromJson(json);
        if (!res) {
          return;
        }
        await writeTextFile(".mhgn-conf.json", result, { dir: BaseDirectory.Home });
      }).catch(err => {
        showSnackbar(err, "error");
      });
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  return (
    <Container>
      {existConfig === null ?
        <Box></Box> :
        !existConfig ?
          <HomeImport
            hiddenFileInput4QrCode={hiddenFileInput4QrCode}
            onFileInput4QrCodeChange={onFileInput4QrCodeChange}
            onOpenFileBrowser4Json={onOpenFileBrowser4Json}
            router={router}
          />
          :
          <HomeEmailAction />
      }
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}>
        <Alert severity={serverity} onClose={handleSnackbarClose}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

HomePage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default HomePage;