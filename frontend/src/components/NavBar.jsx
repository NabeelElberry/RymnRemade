import { Link } from "react-router-dom";
import React, { useState } from "react";
import rymnPng from "../assets/rymnpngtransparent.png";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
export default function NavBar({ profile }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links = [
    "/profileManagement",
    "/termManagement",
    "/reviewTerms",
    "/viewTerms",
    "/viewStats",
  ];

  const names = [
    "Profile Management",
    "Term Management",
    "Review Terms",
    "View Terms",
    "View Stats",
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box
      sx={{
        display: "flex",
        width: "250px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "auto",
        }}
      >
        <ListItem
          sx={{
            width: "50%",
            height: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={rymnPng}
            className="hover:scale-110 transition ease-in-out"
            alt="Sample"
          />
        </ListItem>
        {names.map((text, index) => (
          <ListItem
            key={text}
            component={Link}
            to={links[index]}
            onClick={toggleDrawer(false)}
            sx={{ textAlign: "center", width: "100%" }}
            className="hover:scale-110 transition text-textcolor ease-in-out"
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Dropshadow for navbar in App.css
  return (
    <div className="navbar text-3xl absolute w-full pl-4 h-16 pt-2 pb-2 inset-x-0 top-0 bg-slate-400 flex flex-row items-center z-50 bg-navbarcolor">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        className="mr-10"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          ".MuiDrawer-paper": {
            backgroundColor: "#5C3F76",
          },
        }}
      >
        {drawerList()}
      </Drawer>
      <Link to="/" className="ml-3 rymn">
        <img
          src={rymnPng}
          className="h-14 hover:scale-105 transition ease-in-out"
          alt="Logo"
        />
      </Link>
      <p className="ml-auto mr-auto">Current Profile: {profile} </p>
    </div>
  );
}
