"use client";
import * as React from "react";
import { Box, Container, TextField, Button, Typography, Paper, InputAdornment, IconButton, Link, FormHelperText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Şifre en az 8 karakter olmalıdır";
    }
    if (!/\d/.test(password)) {
      return "Şifre en az bir rakam içermelidir";
    }
    if (!/[a-z]/.test(password)) {
      return "Şifre en az bir küçük harf içermelidir";
    }
    if (!/[A-Z]/.test(password)) {
      return "Şifre en az bir büyük harf içermelidir";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    const confirmError = formData.password !== formData.confirmPassword ? "Şifreler eşleşmiyor" : "";

    setErrors({
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (!passwordError && !confirmError) {
      fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`http://localhost:8080/user/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: data.uid,
              name: formData.name,
              email: formData.email,
            }),
          }).then((res) => {
            if (res.ok) {
              router.push("/signin");
            }
          });
        });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage:
          "url('https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
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
              Hesap Oluştur
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Ad Soyad"
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2563eb" }} />
                  </InputAdornment>
                ),
              }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

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
              error={!!errors.password}
              helperText={errors.password}
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

            <TextField
              fullWidth
              margin="normal"
              label="Şifre Tekrar"
              variant="outlined"
              required
              type={showConfirmPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#2563eb" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />

            <FormHelperText sx={{ mt: 2 }}>
              Şifreniz en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.
            </FormHelperText>

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
              Kayıt Ol
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Zaten hesabınız var mı?{" "}
              <Link href="/signin" underline="hover" sx={{ color: "#2563eb" }}>
                Giriş yap
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
