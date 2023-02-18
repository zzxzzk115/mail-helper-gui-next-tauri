import { Stack, Button, Link, Alert, AlertTitle } from "@mui/material";

import FileUploadIcon from '@mui/icons-material/FileUpload';
import QrCodeIcon from '@mui/icons-material/QrCode';

const HomeImport = (props) => {

  const { onOpenFileBrowser4Json, onFileInput4QrCodeChange, router, hiddenFileInput4QrCode } = props;

  return (
    <Stack spacing={3} marginTop={3} justifyItems="center">
      <Alert severity="info">
        <AlertTitle>Configuration not found!</AlertTitle>
        Please import your configuration,
        or go to <Link onClick={() => router.push("/settings")}>Settings</Link> page for setting it manually.
      </Alert>
      <Button
        variant="contained"
        style={{ textTransform: "none" }}
        startIcon={<FileUploadIcon />}
        onClick={onOpenFileBrowser4Json}>
        Import from a JSON file
      </Button>
      <Button
        variant="contained"
        style={{ textTransform: "none" }}
        startIcon={<QrCodeIcon />}
        onClick={() => hiddenFileInput4QrCode.current.click()}>
        Import from a QR-Code image
        <input
          hidden
          type="file"
          ref={hiddenFileInput4QrCode}
          onChange={onFileInput4QrCodeChange}
          accept="image/*" />
      </Button>
    </Stack>
  );
};

export default HomeImport;