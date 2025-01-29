"use client";
import { RootState } from "@/store";
import { doctorActions } from "@/store/doctorSlice";
import { userActions } from "@/store/userSlice";
import { AppBar, Button, Link, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const { isAuthenticated, name } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const uToken = localStorage?.getItem("UTOKEN") ? localStorage.getItem("UTOKEN") : "";
  const id = localStorage?.getItem("UID") ? localStorage.getItem("UID") : "";
  useEffect(() => {
    const indicator = localStorage?.getItem("indicator") || "";
    if (id) {
      fetch(!indicator ? `http://localhost:8080/user/?uid=${id}` : `http://localhost:8080/doctor/?uid=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data && !indicator;
          dispatch(
            userActions.setUser({
              ...data,
              token: uToken,
            })
          );
          indicator && dispatch(doctorActions.setSelectedDoctor(data));
        });
    }
  }, []);

  const handleLogOut = () => {
    dispatch(userActions.clearUser());
    dispatch(doctorActions.clearSelectedDoctor());
    localStorage.removeItem("UTOKEN");
    localStorage.removeItem("UID");
    localStorage.removeItem("indicator");
  };

  return !isAuthenticated && id?.length === 0 ? (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Link href="/" underline="none" sx={{ flexGrow: 1, color: "#2563eb", fontWeight: "bold" }}>
          <Typography variant="h5">Doktorum</Typography>
        </Link>
        <Link href="/signin" underline="none">
          <Button sx={{ mx: 1 }} variant="outlined" color="primary">
            Giriş Yap
          </Button>
        </Link>
        <Link href="/doctor-register" underline="none">
          <Button sx={{ mx: 1 }} variant="contained" color="primary">
            Doktor Kayıt
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Link href="/" underline="none" sx={{ flexGrow: 1, color: "#2563eb", fontWeight: "bold" }}>
          <Typography variant="h5">Doktorum</Typography>
        </Link>
        <Button onClick={handleLogOut} sx={{ mx: 1 }} variant="contained" color="primary">
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
