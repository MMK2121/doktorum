"use client";
import * as React from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  FormHelperText,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Select,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { doctorActions } from "@/store/doctorSlice";

const specialties = [
  "Genel Cerrahi",
  "Kardiyoloji",
  "Diş Hekimliği",
  "Dermatoloji",
  "Ortopedi",
  "Nöroloji",
  "Psikiyatri",
  "Göz Hastalıkları",
  "Kulak Burun Boğaz",
  "Üroloji",
  "Kadın Hastalıkları ve Doğum",
  "Çocuk Sağlığı ve Hastalıkları",
  "Fizik Tedavi ve Rehabilitasyon",
  "Endokrinoloji",
  "Gastroenteroloji",
  "Göğüs Hastalıkları",
  "İç Hastalıkları",
  "Kalp ve Damar Cerrahisi",
  "Beyin ve Sinir Cerrahisi",
  "Plastik ve Rekonstrüktif Cerrahi",
  "Radyoloji",
  "Anesteziyoloji ve Reanimasyon",
  "Enfeksiyon Hastalıkları",
  "Hematoloji",
  "Onkoloji",
  "Romatoloji",
  "Nefroloji",
  "Aile Hekimliği",
];

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "İçel (Mersin)",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce",
];

const workingDays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

const workingHours = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialty: string;
  licenseNumber: string;
  education: string;
  hospitalAffiliation: string;
  experience: string;
  address: string;
  city: string;
  district: string;
  availableDays: string[];
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
}

export default function DoctorRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
    education: "",
    hospitalAffiliation: "",
    experience: "",
    address: "",
    city: "",
    district: "",
    availableDays: [],
    startTime: dayjs().set("hour", 9).set("minute", 0),
    endTime: dayjs().set("hour", 17).set("minute", 0),
  });
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
  });

  const handleNext = async () => {
    setActiveStep(1);
  };

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

  const validateLicenseNumber = (license: string) => {
    if (!/^\d{6}$/.test(license)) {
      return "Lisans numarası 6 haneli bir sayı olmalıdır";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = formData.name.length === 0 ? "Ad Soyadı boş bırakılamaz" : "";
    const emailError = formData.email.length === 0 ? "E posta boş bırakılamaz" : "";
    const passwordError = validatePassword(formData.password);
    const confirmError = formData.password !== formData.confirmPassword ? "Şifreler eşleşmiyor" : "";
    const licenseError = validateLicenseNumber(formData.licenseNumber);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError,
      licenseNumber: licenseError,
    });

    if (!passwordError && !confirmError && !licenseError) {
      setActiveStep(1);
    }
    fetch("http://localhost:8080/doctor/create", {
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
        router.push("/signin");
      });
  };

  const handleDaysChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, availableDays: event.target.value as string[] });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage:
          "url('https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 12,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Kayit Bilgileri</StepLabel>
            </Step>
            <Step>
              <StepLabel>Doktor Bilgileri</StepLabel>
            </Step>
          </Stepper>

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#2563eb" }}>
              {activeStep === 0 ? "E posta ile Giriş Yapın" : "Doktor Bilgilerini Tamamlayın"}
            </Typography>

            {activeStep === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ad Soyadı"
                  variant="outlined"
                  required
                  error={!!errors.name}
                  helperText={errors.name}
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
                  required
                  error={!!errors.email}
                  helperText={errors.email}
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
              </Box>
            )}

            {activeStep === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Uzmanlık Alanı"
                    select
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                          },
                        },
                      },
                    }}
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Lisans Numarası"
                    variant="outlined"
                    required
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Adres"
                    variant="outlined"
                    required
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="Şehir"
                    variant="outlined"
                    required
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                          },
                        },
                      },
                    }}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="İlçe"
                    variant="outlined"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    SelectProps={{ multiple: true }}
                    margin="normal"
                    label="Çalışma Günleri"
                    variant="outlined"
                    required
                    value={formData.availableDays}
                    onChange={handleDaysChange}
                  >
                    {workingDays.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                      <TimePicker
                        label="Başlangıç Saati"
                        value={formData.startTime}
                        onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                        minutesStep={30}
                        ampm={false}
                        sx={{ flex: 1 }}
                      />
                      <Typography sx={{ mx: 1 }}>-</Typography>
                      <TimePicker
                        label="Bitiş Saati"
                        value={formData.endTime}
                        onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                        minutesStep={30}
                        ampm={false}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Eğitim Bilgileri"
                    variant="outlined"
                    required
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Çalıştığı Hastane/Klinik"
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.hospitalAffiliation}
                    onChange={(e) => setFormData({ ...formData, hospitalAffiliation: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Deneyim (Yıl)"
                    variant="outlined"
                    type="number"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: "#2563eb" }} />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </Grid>
              </Grid>
            )}
            {activeStep === 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  sx={{
                    height: "56px",
                    flex: 1,
                    background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                    },
                  }}
                >
                  Devam et
                </Button>
              </Box>
            )}
            {activeStep === 1 && (
              <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setActiveStep(0)}
                  sx={{
                    height: "56px",
                    flex: 1,
                  }}
                >
                  Geri
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    height: "56px",
                    flex: 2,
                    background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                    },
                  }}
                >
                  Kaydı Tamamla
                </Button>
              </Box>
            )}

            <Typography align="center" sx={{ mt: 2 }}>
              Kullanıcı mısınız?{" "}
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
