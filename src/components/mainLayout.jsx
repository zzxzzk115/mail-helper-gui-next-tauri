import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper
} from "@mui/material";
import { Home, Settings, Info } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";

const MainLayout = ({ children }) => {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

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
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<Home />} onClick={() => onLink('/home')}/>
          <BottomNavigationAction label="Settings" icon={<Settings />} onClick={() => onLink('/settings')}/>
          <BottomNavigationAction label="About" icon={<Info />} onClick={() => onLink('/about')}/>
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MainLayout;