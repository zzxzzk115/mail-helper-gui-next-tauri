import { Button, Checkbox, Container, IconButton, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import MainLayout from "../components/MainLayout";

const ConfigurationPage = () => {

  const router = useRouter();
  const [configJson, setConfigJson] = useState(null);

  const loadConfiguration = async () => {
    const exist = await exists(".mhgn-conf.json", { dir: BaseDirectory.Home });
    if (exist) {
      const conf = await readTextFile(".mhgn-conf.json", { dir: BaseDirectory.Home });
      setConfigJson(JSON.parse(conf));
    } else {
      setConfigJson({
        "gophish_api_key": "",
        "gophish_host": "",
        "smtp_host": "",
        "smtp_user_name": "",
        "smtp_user_password": "",
        "ignore_certificate_errors": true
      });
    }
  };

  const goBack = () => {
    router.back();
  };

  const onChange = (key, checked) => (event) => {
    let newConf = { ...configJson };
    if (checked) {
      newConf[key] = event.target.checked;
    } else {
      newConf[key] = event.target.value;
    }
    setConfigJson(newConf);
  };

  const onApply = async () => {
    console.log(configJson);
    await writeTextFile({ path: ".mhgn-conf.json", contents: JSON.stringify(configJson) }, { dir: BaseDirectory.Home });
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  return (
    <Container>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon color="primary" />
        </IconButton>
        <Typography variant="h4" color="primary">Configuration Settings</Typography>
      </Stack>
      {
        configJson &&
        <Stack marginTop={3} spacing={3} >
          <TextField
            required
            label="Gophish API Key"
            value={configJson["gophish_api_key"]}
            onChange={onChange("gophish_api_key")} />
          <TextField
            required
            type="url"
            label="Gophish Host"
            value={configJson["gophish_host"]}
            onChange={onChange("gophish_host")} />
          <TextField
            required
            label="SMTP Host"
            value={configJson["smtp_host"]}
            onChange={onChange("smtp_host")} />
          <TextField
            type="email"
            label="SMTP User Name"
            value={configJson["smtp_user_name"]}
            onChange={onChange("smtp_user_name")} />
          <TextField
            type="password"
            label="SMTP User Password"
            value={configJson["smtp_user_password"]}
            onChange={onChange("smtp_user_password")} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Ignore Certificate Errors</Typography>
            <Checkbox
              checked={configJson["ignore_certificate_errors"]}
              onChange={onChange("ignore_certificate_errors", true)} />
          </Stack>
          <Button onClick={onApply} variant="contained" fullWidth>Apply</Button>
        </Stack>
      }
    </Container>
  );
};

ConfigurationPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default ConfigurationPage;