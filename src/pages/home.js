import {
  Container,
  Button,
  Link,
  Spacer
} from "@nextui-org/react";

import { Alert, AlertTitle, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import QrScanner from 'qr-scanner';
import { exists, BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { open } from '@tauri-apps/api/dialog';

import MainLayout from "../components/MainLayout";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import QrCodeIcon from '@mui/icons-material/QrCode';

const HomePage = () => {

  const router = useRouter();

  const [existConfig, setExistConfig] = useState(false);

  const hiddenFileInput4QrCode = useRef(null);

  function onFileInput4QrCodeChange(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.search("image/") === -1) {
        return;
      }
      QrScanner.scanImage(event.target.files[0]).then(result => console.log(result)).catch(err=>console.error(err));
    }
  }

  async function loadConfiguration() {
    setExistConfig(await exists("conf.json", { dir: BaseDirectory.AppConfig }));
  }

  async function onOpenFileBrowser4Json() {
    const selected = await open({
      filters: [{
        name: "JSON",
        extensions: ["json"]
      }]
    });
    if (selected) {
      const configFile = await readTextFile(selected);
      console.log(configFile);
    }
  }

  useEffect(() => {
    loadConfiguration();
  }, []);

  return (
    <Box>{!existConfig ?
      <Container
        display="flex"
        direction="column"
        justify="center"
        alignItems="center">
        <Spacer>15</Spacer>
        <Alert severity="info">
          <AlertTitle>Configuration not found!</AlertTitle>
          Please import your configuration,
          or go to <Link onClick={() => router.replace("/settings")}>Settings</Link> page for setting it manually.
        </Alert>
        <Spacer>15</Spacer>
        <Button
          auto
          color="primary"
          style={{ width: 300 }}
          icon={<FileUploadIcon />}
          onPress={onOpenFileBrowser4Json}>
          Import from JSON file
        </Button>
        <Spacer>15</Spacer>
        <Button
          auto
          color="primary"
          style={{ width: 300 }}
          icon={<QrCodeIcon />}
          onPress={()=>hiddenFileInput4QrCode.current.click()}>
          Import from QR-Code
          <input
            hidden
            type="file"
            ref={hiddenFileInput4QrCode}
            onChange={onFileInput4QrCodeChange}
            accept="image/*" />
        </Button>
      </Container>
      :
      <Box>
        ???
      </Box>}
    </Box>
  );
};

HomePage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default HomePage;