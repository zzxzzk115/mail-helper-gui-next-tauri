import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import MainLayout from "../components/MainLayout";
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from "@mui/icons-material/GitHub";
import { open } from "@tauri-apps/api/shell";

const AboutPage = () => {
  return (
    <Container>
      <Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          marginBottom={3}>
          <InfoIcon color="primary" fontSize="large" />
          <Typography variant="h4" color="primary">About</Typography>
        </Stack>
      </Box>
      <Stack marginTop={15} spacing={6} justifyContent="center" alignItems="center">
        <img src="/logo.png" width={150} />
        <Typography variant="h5">A tool for testing mail-spoofing.</Typography>
        <Typography>For Educational Usage Only!!!</Typography>
        <Typography>GitHub Repo:<IconButton color="primary" onClick={()=>open("https://github.com/zzxzzk115/mail-helper-gui-next-tauri/")}><GitHubIcon /></IconButton></Typography>
      </Stack>

    </Container>
  );
};

AboutPage.getLayout = (page) => {
  return (
    <MainLayout>{page}</MainLayout>
  )
};

export default AboutPage;