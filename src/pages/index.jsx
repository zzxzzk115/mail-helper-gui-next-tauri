import {
  Container,
  Button,
  Text,
  Image,
  Spacer
} from "@nextui-org/react";

function App() {

  function start() {
    
  }

  return (
    <Container
      display="flex"
      direction="column"
      justify="center"
      alignItems="center"
      style={{ marginTop: 90 }}>
      <Image src="/logo.png" width={150} height={150} />
      <Spacer y={2} />
      <Text h1>Welcome to Mail Helper Next!</Text>
      <Spacer y={2} />
      <Button onPress={start}>Start</Button>
    </Container>
  );
}

export default App;
