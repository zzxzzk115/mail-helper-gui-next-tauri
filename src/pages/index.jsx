import {
  Container,
  Button,
  Text,
  Image,
  Spacer
} from "@nextui-org/react";

import {
  Alert,
  AlertTitle
} from "@mui/material";

import {
  Home
} from "@mui/icons-material";

function App() {

  function start() {

  }

  return (
    <Container
      display="flex"
      direction="column"
      justify="center"
      alignItems="center"
      style={{ marginTop: 30 }}>
      <Alert severity="info" icon={<Home fontSize="inherit" />}>
        <AlertTitle>Tips</AlertTitle>
        The app is still developing !
      </Alert>
      <Spacer y={2} />
      <Image src="/logo.png" width={150} height={150} />
      <Spacer y={2} />
      <Text h1>Welcome to Mail Helper Next!</Text>
      <Spacer y={2} />
      <Button onPress={start}>Start</Button>

    </Container>
  );
}

export default App;
