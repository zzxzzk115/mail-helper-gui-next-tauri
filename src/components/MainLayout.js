import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper
} from "@mui/material";
import { Home, Settings, Info } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MainLayout = ({ children }) => {
  const [tabValue, setTabValue] = useState("/home");
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setTabValue(url);
    }

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    }
  }, []);

  function onLink(href) {
    router.replace(href);
  };

  return (
    <Box>
      {children}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={6}>
        <BottomNavigation
          showLabels
          value={tabValue}
        >
          <BottomNavigationAction value="/home" label="Home" icon={<Home />} onClick={() => onLink('/home')} />
          <BottomNavigationAction value="/settings" label="Settings" icon={<Settings />} onClick={() => onLink('/settings')} />
          <BottomNavigationAction value="/about" label="About" icon={<Info />} onClick={() => onLink('/about')} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MainLayout;