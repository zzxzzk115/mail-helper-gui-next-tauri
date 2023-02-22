import { Container, Alert, Box, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import QrScanner from 'qr-scanner';
import { exists, BaseDirectory, readTextFile, copyFile, writeTextFile } from "@tauri-apps/api/fs";
import { open } from '@tauri-apps/api/dialog';
import dynamic from "next/dynamic";

import MainLayout from "../components/MainLayout";
import HomeImport from "../components/HomeImport";

// DO NOT import tauri wrapped component like this:
// import HomeEmailAction from "../components/HomeEmailAction";
// This will cause SSR problem.
// You should always use `dynamic import` by Next.js
const HomeEmailAction = dynamic(()=>import("../components/HomeEmailAction"), {
  ssr: false
});

const HomePage = () => {

  const router = useRouter();
  const [existConfig, setExistConfig] = useState(null);
  const hiddenFileInput4QrCode = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [serverity, setServerity] = useState("info");
  const [configJson, setConfigJson] = useState(null);

  const loadConfiguration = async () => {
    const exist = await exists(".mhgn-conf.json", { dir: BaseDirectory.Home });
    if (exist) {
      const conf = await readTextFile(".mhgn-conf.json", { dir: BaseDirectory.Home });
      setConfigJson(JSON.parse(conf));
    }
    setExistConfig(exist);
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

  const onOpenFileBrowser4Json = async () => {
    const selected = await open({
      filters: [{
        name: "JSON",
        extensions: ["json"]
      }]
    });
    if (selected) {
      const configFile = await readTextFile(selected);
      let json = JSON.parse(configFile);
      let result = importFromJson(json);
      if (!result) {
        return;
      }

      // Copy to AppConfig
      await copyFile(selected, ".mhgn-conf.json", { dir: BaseDirectory.Home });
      setExistConfig(true);
      showSnackbar("Successfully imported configuration", "success");
    }
  }

  const onFileInput4QrCodeChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.search("image/") === -1) {
        showSnackbar("Not an image!", "error");
        return;
      }
      QrScanner.scanImage(event.target.files[0]).then(async (result) => {
        let json = JSON.parse(result);
        let res = importFromJson(json);
        if (!res) {
          return;
        }
        await writeTextFile(".mhgn-conf.json", result, { dir: BaseDirectory.Home });
        setExistConfig(true);
        showSnackbar("Successfully imported configuration", "success");
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
          <HomeEmailAction conf={configJson} />
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