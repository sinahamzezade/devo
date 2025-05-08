import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const pathname = usePathname();

  return (
    <AppBar
      position="static"
      className="bg-gradient-to-r from-primary to-primary/80"
    >
      <Toolbar className="justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-white no-underline">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="home"
              sx={{ mr: 1 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Smart Insurance Portal
            </Typography>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/apply" passHref>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              className={pathname === "/apply" ? "bg-white/20" : ""}
            >
              Apply
            </Button>
          </Link>
          <Link href="/submissions" passHref>
            <Button
              color="inherit"
              startIcon={<ListAltIcon />}
              className={pathname === "/submissions" ? "bg-white/20" : ""}
            >
              Applications
            </Button>
          </Link>
          <Tooltip
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="default"
                />
              }
              label={
                darkMode ? (
                  <DarkModeIcon fontSize="small" className="text-yellow-300" />
                ) : (
                  <LightModeIcon fontSize="small" className="text-white" />
                )
              }
            />
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
