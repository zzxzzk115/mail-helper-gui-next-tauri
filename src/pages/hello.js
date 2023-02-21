import LocalStorageExtend from "../utils/LocalStorageExtend";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";

const HelloPage = () => {

  const router = useRouter();
  const firstLoadKey = "is-first-load";

  useEffect(() => {
    LocalStorageExtend.setToStorage(firstLoadKey, false);
  }, []);

  return (
    <Container>
      <Stack
        spacing={6}
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        marginTop={30}
      >
        <Typography variant="h3">Mail Helper Next</Typography>
        <img src="/logo.png" width={150} height={150} />
        <Button size="large" variant="contained" onClick={() => router.replace('/home')}>Start</Button>
      </Stack>
    </Container>
  );
};

export default HelloPage;