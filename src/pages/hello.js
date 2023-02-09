import {
  Container,
  Button,
  Text,
  Image,
  Spacer
} from "@nextui-org/react";

import LocalStorageExtend from "../utils/LocalStorageExtend";
import { useRouter } from "next/router";
import { useEffect } from "react";

const HelloPage = () => {

  const router = useRouter();

  const firstLoadKey = "is-first-load";

  useEffect(() => {
    LocalStorageExtend.setToStorage(firstLoadKey, false);
  }, []);

  function onPress() {
    router.replace('/home');
  }

  return (
    <Container
      display="flex"
      direction="column"
      justify="center"
      alignItems="center"
      style={{ marginTop: 140 }}>
      <Text h2>Mail Helper Next</Text>
      <Spacer y={2} />
      <Image src="/logo.png" width={150} height={150} />
      <Spacer y={5} />
      <Button onPress={onPress}>Start</Button>
    </Container>
  );
};

export default HelloPage;