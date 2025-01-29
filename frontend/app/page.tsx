"use client";
import * as React from "react";
import { Typography, Button, Container, TextField, Box, MenuItem, Card, Grid, Link, CardContent, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { userActions } from "@/store/userSlice";
import { doctorActions } from "@/store/doctorSlice";

const locations = [
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

interface FilterState {
  specialty: string;
  city: string;
  date?: dayjs.Dayjs | null;
}
export default function Home() {
  const user = useSelector((state: RootState) => state.user);
  const { selectedDr, doctors, patients } = useSelector((state: RootState) => state.doctor);
  const router = useRouter();
  const [filters, setFilters] = React.useState<FilterState>({
    specialty: "",
    city: "",
    date: null,
  });
  const dispatch = useDispatch();
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    fetch("http://localhost:8080/doctor/all").then((res) => {
      res.json().then((data) => {
        dispatch(doctorActions.setDoctors(data));
      });
    });
    fetch("http://localhost:8080/user/appointments").then((res) => {
      res.json().then((data) => {
        dispatch(userActions.setAppointment(data));
      });
    });

    fetch("http://localhost:8080/user/allUsers")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch(doctorActions.setPatients(data));
      });
  }, []);

  const filteredDoctors = React.useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSpecialty = !filters.specialty || doctor.specialty === filters.specialty;
      const matchesCity = !filters.city || doctor.city === filters.city;
      return matchesSpecialty && matchesCity;
    });
  }, [doctors, filters]);
  return !selectedDr || !localStorage?.getItem("indicator") ? (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f7" }}>
      <Box
        sx={{
          pt: 15,
          pb: 8,
          backgroundImage:
            "url('https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          {!selectedDr && !user.name ? (
            <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 3 }}>
              En Yakın Doktoru Bul
            </Typography>
          ) : (
            <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 3 }}>
              Merhaba, {user.name}
            </Typography>
          )}

          {!selectedDr && (
            <Typography variant="h6" sx={{ mb: 6, opacity: 0.9 }}>
              Doktorlar arasında arama yaparak en yakın doktoru bulabilirsiniz.
            </Typography>
          )}

          {/* Search Form */}
          {!selectedDr && (
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                maxWidth: "100%",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <Container maxWidth="md">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      name="specialty"
                      label="Uzmanlık Alanı"
                      value={filters.specialty}
                      onChange={handleFilterChange}
                      variant="outlined"
                    >
                      <MenuItem value="">Tümü</MenuItem>
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
                      select
                      name="city"
                      label="Şehir"
                      value={filters.city}
                      onChange={handleFilterChange}
                      variant="outlined"
                    >
                      <MenuItem value="">Tümü</MenuItem>
                      {locations.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Container>
            </Card>
          )}
        </Container>
      </Box>

      {user.appointment[0]?.map((appointment, i) => {
        const doctor = doctors.find((doc) => doc.uid === appointment.doctorUid);
        if (appointment.userUid === user.uid && doctor) {
          return (
            <Box
              key={i}
              sx={{
                my: 4,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 3,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                padding: 3,
                margin: 3,
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography align="center" variant="h6" color="text.secondary">
                {doctor.name} doktorundan {dayjs(appointment.date).format("DD.MM.YYYY")} Tarihinde {appointment.time} saatinde randevunuz
                bulunmaktadır.
              </Typography>
            </Box>
          );
        }
        return null;
      })}

      {/* Results Count */}
      {!selectedDr && (
        <Box sx={{ my: 4 }}>
          <Typography align="center" variant="h6" color="text.secondary">
            {filteredDoctors.length} Doktor Bulundu
          </Typography>
        </Box>
      )}

      {/* Doctors Section */}
      {!selectedDr && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={3}>
            {filteredDoctors.map((doctor) => (
              <Grid item xs={12} md={6} lg={4} key={doctor.uid}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Link href={"/doctor/" + doctor.uid} underline="none" sx={{ display: "flex", flex: 1 }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {doctor.name}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {doctor.specialty}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOnIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                          {doctor.address}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocalHospitalIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.hospitalAffiliation}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <SchoolIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.experience} yıl deneyim
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <AccessTimeIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(doctor.startTime).format("HH:mm")} - {dayjs(doctor.endTime).format("HH:mm")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {doctor.availableDays.map((day) => (
                          <Chip key={day} label={day} size="small" sx={{ backgroundColor: "#e2e8f0" }} />
                        ))}
                      </Box>

                      <Button
                        onClick={() => router.push("/create-appointment/" + doctor.uid)}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                      >
                        Randevu Al
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredDoctors.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                backgroundColor: "white",
                borderRadius: 2,
                mt: 4,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Seçilen kriterlere uygun doktor bulunamadı.
              </Typography>
            </Box>
          )}
        </Container>
      )}
    </Box>
  ) : (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f7" }}>
      <Box
        sx={{
          pt: 15,
          pb: 8,
          px: 3,
          backgroundImage:
            "url('https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 3 }}>
          Merhaba, {selectedDr && "Dr."} {selectedDr.name}
        </Typography>

        <Typography variant="h4" color="white" sx={{ mb: 2 }}>
          {selectedDr.specialty} Uzmanı {selectedDr.address}
        </Typography>
        <Typography variant="h6" color="white" sx={{ mb: 4 }}>
          {selectedDr.hospitalAffiliation}
        </Typography>
      </Box>
      {user.appointment[0]?.map((appointment, i) => {
        if (selectedDr && appointment.doctorUid === selectedDr.uid) {
          const matchingPatients = patients.filter((patient) => appointment.userUid === patient.uid);
          return matchingPatients.map((patient) => (
            <Box
              key={i}
              sx={{
                my: 4,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 3,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                padding: 3,
                margin: 3,
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography align="center" variant="h6" color="text.secondary">
                {patient.name} {dayjs(appointment.date).format("DD.MM.YYYY")} Tarihinde {appointment.time} saatinde randevu aldı.
              </Typography>
            </Box>
          ));
        }
        return null;
      })}
    </Box>
  );
}
