"use client";
import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { useParams, useRouter } from "next/navigation";
import Doctor from "@/types/Doctor";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { userActions } from "@/store/userSlice";

const steps = ["Doktor Bilgileri", "Tarih Seçimi", "Saat Seçimi", "Onay"];

export default function CreateAppointment() {
  const params = useParams();
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetch(`http://localhost:8080/doctor/?uid=${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Doktor bulunamadı");
        }
        return res.json();
      })
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [params.id]);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots: string[] = [];

    // Convert times to dayjs objects and extract hours and minutes
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    const startHour = start.hour();
    const startMinute = start.minute();
    const endHour = end.hour();
    const endMinute = end.minute();

    // Convert to minutes since midnight for easier calculation
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Generate slots in 30-minute intervals
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    }

    return slots;
  };

  const isDateAvailable = (date: dayjs.Dayjs) => {
    if (!doctor) return false;
    const dayName = date.locale("tr").format("dddd");
    return doctor.availableDays.includes(dayName);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically submit the appointment to your backend
    const appointmentData = {
      doctorUid: doctor?.uid,
      userUid: user?.uid,
      date: selectedDate?.format("YYYY-MM-DD"),
      time: selectedTime,
    };
    fetch("http://localhost:8080/user/create-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Randevu oluşturulamadı");
        }
        return res.json();
      })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Alert severity="error" sx={{ maxWidth: 500, mx: "auto" }}>
            {error || "Doktor bulunamadı"}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ my: 8, px: { xs: 2, md: 3 } }}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Doctor Information Step */}
            {activeStep === 0 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                  <Card sx={{ height: "100%", borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                        <Avatar src={doctor.photoURL} sx={{ width: 80, height: 80 }} />
                        <Box>
                          <Typography variant="h6">{doctor.name}</Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {doctor.specialty}
                          </Typography>
                          <Rating value={doctor.rating || 0} readOnly size="small" />
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <LocationOnIcon sx={{ color: "primary.main", mr: 1 }} />
                        <Typography variant="body2">
                          {doctor.address}, {doctor.district}, {doctor.city}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <LocalHospitalIcon sx={{ color: "primary.main", mr: 1 }} />
                        <Typography variant="body2">{doctor.hospitalAffiliation}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <AccessTimeIcon sx={{ color: "primary.main", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {dayjs(doctor.startTime).format("HH:mm")} - {dayjs(doctor.endTime).format("HH:mm")}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {doctor.availableDays.map((day) => (
                              <Chip key={day} label={day} size="small" sx={{ backgroundColor: "primary.main", color: "white" }} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Date Selection Step */}
            {activeStep === 1 && (
              <Box sx={{ maxWidth: 400, mx: "auto" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                  <DatePicker
                    label="Randevu Tarihi"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    disablePast
                    shouldDisableDate={(date) => !isDateAvailable(date)}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  * Sadece doktorun müsait olduğu günler seçilebilir
                </Typography>
              </Box>
            )}

            {/* Time Selection Step */}
            {activeStep === 2 && selectedDate && (
              <Box sx={{ maxWidth: 400, mx: "auto" }}>
                <FormControl fullWidth>
                  <InputLabel>Randevu Saati</InputLabel>
                  <Select value={selectedTime || ""} onChange={(e) => setSelectedTime(e.target.value)} label="Randevu Saati">
                    {generateTimeSlots(doctor.startTime, doctor.endTime).map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Confirmation Step */}
            {activeStep === 3 && (
              <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Card sx={{ mb: 3, bgcolor: "primary.main", color: "white" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Randevu Özeti
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                          Doktor
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {doctor.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                          Uzmanlık
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {doctor.specialty}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                          Tarih
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {selectedDate?.format("DD MMMM YYYY")}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                          Saat
                        </Typography>
                        <Typography variant="h6">{selectedTime}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined">
                  Geri
                </Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={(activeStep === 1 && !selectedDate) || (activeStep === 2 && !selectedTime)}
                  sx={{
                    background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                    },
                  }}
                >
                  İleri
                </Button>
              )}
              {activeStep === steps.length - 1 && (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                    },
                  }}
                >
                  Randevu Oluştur
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
