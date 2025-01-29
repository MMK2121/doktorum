"use client";
import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useParams, useRouter } from "next/navigation";
import Doctor from "@/types/Doctor";
import dayjs from "dayjs";

// Mock comments data
const mockComments = [
  {
    id: 1,
    userName: "Ahmet Y.",
    rating: 5,
    date: "2024-01-15",
    comment: "Çok ilgili ve profesyonel bir doktor. Kesinlikle tavsiye ederim.",
  },
  {
    id: 2,
    userName: "Ayşe K.",
    rating: 4,
    date: "2024-01-10",
    comment: "Randevu saatine uyuyor ve hastalarıyla yakından ilgileniyor.",
  },
  // Add more comments as needed
];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const turkishCities = [
  "adana",
  "adiyaman",
  "afyon",
  "agri",
  "aksaray",
  "amasya",
  "ankara",
  "antalya",
  "ardahan",
  "artvin",
  "aydin",
  "balikesir",
  "bartin",
  "batman",
  "bayburt",
  "bilecik",
  "bingol",
  "bitlis",
  "bolu",
  "burdur",
  "bursa",
  "canakkale",
  "cankiri",
  "corum",
  "denizli",
  "diyarbakir",
  "duzce",
  "edirne",
  "elazig",
  "erzincan",
  "erzurum",
  "eskisehir",
  "gaziantep",
  "giresun",
  "gumushane",
  "hakkari",
  "hatay",
  "igdir",
  "isparta",
  "istanbul",
  "izmir",
  "kahramanmaras",
  "karabuk",
  "karaman",
  "kars",
  "kastamonu",
  "kayseri",
  "kilis",
  "kirikkale",
  "kirklareli",
  "kirsehir",
  "kocaeli",
  "konya",
  "kutahya",
  "malatya",
  "manisa",
  "mardin",
  "mersin",
  "mugla",
  "mus",
  "nevsehir",
  "nigde",
  "ordu",
  "osmaniye",
  "rize",
  "sakarya",
  "samsun",
  "sanliurfa",
  "siirt",
  "sinop",
  "sirnak",
  "sivas",
  "tekirdag",
  "tokat",
  "trabzon",
  "tunceli",
  "usak",
  "van",
  "yalova",
  "yozgat",
  "zonguldak",
];

interface Coordinates {
  lat: number;
  lng: number;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = React.useState<Doctor>();
  const [newComment, setNewComment] = React.useState("");
  const [newRating, setNewRating] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [coordinates, setCoordinates] = React.useState<{ lat: number; lng: number } | null>(null);
  const [mapLoading, setMapLoading] = React.useState(true);
  const [geocodeError, setGeocodeError] = React.useState("");

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
        console.error(error);
      });
  }, []);

  const geocodeTurkishAddress = async (address: string) => {
    try {
      const normalizedAddress = address
        .toLowerCase()
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/ /g, "+");

      const hasValidCity = turkishCities.some((city) => normalizedAddress.includes(city));
      if (!hasValidCity) throw new Error("Geçersiz adres formatı");

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${normalizedAddress},+Turkey&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      if (data.status === "OK") {
        return data.results[0].geometry.location;
      }
      throw new Error(data.error_message || `Geocoding failed: ${data.status}`);
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    if (!doctor?.address) return;
    const fetchCoordinates = async () => {
      try {
        setMapLoading(true);
        const coords = await geocodeTurkishAddress(doctor.address);

        setCoordinates(coords);
        setGeocodeError("");
      } catch (error) {
        setGeocodeError(error instanceof Error ? error.message : "Harita yüklenemedi");
        setCoordinates(null);
      } finally {
        setMapLoading(false);
      }
    };
    fetchCoordinates();
  }, [doctor?.address]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h4" align="center">
            Doktor bulunamadı
          </Typography>
        </Container>
      </Box>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New comment:", { rating: newRating, comment: newComment });
    setNewComment("");
    setNewRating(null);
  };

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          color: "white",
          pt: { xs: 6, md: 12 },
          pb: { xs: 16, md: 18 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pl: { xs: 2, md: 0 } }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {doctor.name}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              {doctor.specialty}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 }, mb: 8, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ textAlign: "center", p: { xs: 3, md: 4 } }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push("/create-appointment/" + doctor.uid)}
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #2563eb 0%, #1e40af 100%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1e40af 0%, #1e3a8a 100%)",
                    },
                  }}
                >
                  Randevu Al
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <List sx={{ "& .MuiListItem-root": { px: 0, py: 2 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          Adres
                        </Typography>
                      }
                      secondary={doctor.address}
                      sx={{ "& .MuiTypography-root": { lineHeight: 1.6 } }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <LocalHospitalIcon color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          Hastane
                        </Typography>
                      }
                      secondary={doctor.hospitalAffiliation}
                      sx={{ "& .MuiTypography-root": { lineHeight: 1.6 } }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          Eğitim
                        </Typography>
                      }
                      secondary={doctor.education}
                      sx={{ "& .MuiTypography-root": { lineHeight: 1.6 } }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon color="primary" sx={{ fontSize: 28 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          Çalışma Saatleri
                        </Typography>
                      }
                      secondary={
                        <Box component="div">
                          <Typography variant="body2" component="span" sx={{ mb: 1, display: "block" }}>
                            {dayjs(doctor.startTime).format("HH:mm")} - {dayjs(doctor.endTime).format("HH:mm")}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {doctor.availableDays.map((day, i) => (
                              <Chip
                                key={i}
                                label={day}
                                size="small"
                                sx={{
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  fontWeight: "medium",
                                  px: 1,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                      sx={{ "& .MuiTypography-root": { lineHeight: 1.6 } }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <Card sx={{ mb: 4, mt: 12, borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Hakkında
                </Typography>
                <Typography paragraph sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                  {doctor.experience} yıllık deneyime sahip uzman hekim. {doctor.specialty} alanında uzmanlaşmış olup,
                  {doctor.hospitalAffiliation}'nde görev yapmaktadır.
                </Typography>
              </CardContent>
            </Card>

            {/* Location Section */}
            {mapLoading ? (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Harita yükleniyor...
                </Typography>
              </Box>
            ) : coordinates ? (
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY!}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={coordinates}
                  zoom={14}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                      },
                    ],
                  }}
                >
                  {coordinates && (
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates} zoom={14}>
                      <Marker position={coordinates} />
                    </GoogleMap>
                  )}
                </GoogleMap>
              </LoadScript>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1" color="error">
                  {geocodeError || "Harita gösterilemiyor"}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                  Tekrar Dene
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
