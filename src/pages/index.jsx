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

import useLocalStorage from "../utils/useLocalStorage";

function App() {

  const [isFirstLoad, setIsFirstLoad] = useLocalStorage("is-first-load", true);

  function start() {
    setIsFirstLoad(false);
  }

  return (
    isFirstLoad 
    ?
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
    :
    <Text>Hello world!</Text>
  );
}

export default App;
