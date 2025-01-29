"use client";
import * as React from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleButton from "@/components/GoogleButton";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userSlice";
import { useRouter } from "next/navigation";
import { doctorActions } from "@/store/doctorSlice";

export default function LoginPage() {
  const [tab, setTab] = React.useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8080/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Giriş başarısız");
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        const link = tab === 0 ? `http://localhost:8080/user/?uid=${data.uid}` : `http://localhost:8080/doctor/?uid=${data.uid}`;
        fetch(link, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.statusCode === 500) return;

            if (data) {
              tab === 0 &&
                dispatch(
                  userActions.setUser({
                    ...data,
                    token: data.token,
                  })
                );
              tab === 1 && localStorage.setItem("indicator", "dctr");
              tab === 1 && dispatch(doctorActions.setSelectedDoctor(data));
              localStorage.setItem("UTOKEN", data.token);
              localStorage.setItem("UID", data.uid);
              router.push("/");
            }
          });
      })
      .catch((error) => {
        console.error("Error during sign-in:", error.message);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage:
          "url('https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 12,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#2563eb" }}>
              Doktorum'a Hoş Geldiniz
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Button
                  fullWidth
                  variant={tab === 0 ? "contained" : "outlined"}
                  onClick={() => setTab(0)}
                  sx={{
                    py: 1.5,
                    background: tab === 0 ? "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)" : "transparent",
                    "&:hover": {
                      background: tab === 0 ? "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)" : "transparent",
                    },
                  }}
                >
                  Hasta
                </Button>
                <Button
                  fullWidth
                  variant={tab === 1 ? "contained" : "outlined"}
                  onClick={() => setTab(1)}
                  sx={{
                    py: 1.5,
                    background: tab === 1 ? "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)" : "transparent",
                    "&:hover": {
                      background: tab === 1 ? "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)" : "transparent",
                    },
                  }}
                >
                  Doktor
                </Button>
              </Box>
            </Box>
            <Divider />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              type="email"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#2563eb" }} />
                  </InputAdornment>
                ),
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Şifre"
              variant="outlined"
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#2563eb" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
              }}
            ></Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                height: "56px",
                background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                },
              }}
            >
              Giriş Yap
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Hesabınız yok mu?{" "}
              <Link href="/signup" underline="hover" sx={{ color: "#2563eb" }}>
                Kayıt ol
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
