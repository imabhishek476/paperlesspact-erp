import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Cookies from "js-cookie";
import { Alert, Typography } from "@mui/material";
// This website uses cookies to provide you with a great user experience. By using it, you accept our use of cookies

const CookieSnackbar = () => {
  const isCookie = Cookies.get("isCookie");
  const [open, setOpen] = useState(isCookie === "false" ? false : true);
  const [display, setDisplay] = useState("none");

  const handleClose = () => {
    Cookies.set("isCookie", "false");
    setOpen(false);
  };
  useEffect(() => {
    if(isCookie && (isCookie=== 'false')){
    setDisplay("none")
    } else {
      setDisplay("flex")
    
    }
  
    
  }, [isCookie])
  
  console.log(isCookie && (isCookie=== 'false'))
  console.log(Boolean(isCookie))
  console.log((isCookie=== 'false'))
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: 1000,
        display:  display
      }}
    >
      <Alert
        onClose={handleClose}
        //   severity="success"
        className="shadow-md text-black"
        sx={{
          width: "100%",
          pr: 3,
          pl: 3,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6">
          This website uses cookies to provide you with a great user experience.
          By using it, you accept our use of cookies
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default CookieSnackbar;
