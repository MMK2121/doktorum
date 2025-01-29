# Doctor Appointment System (w/ Microservises)

![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

[video link](https://drive.google.com/file/d/1B2jbbtYT6TSkJRV5DxI2sJnx50VMzQDb/view?usp=drive_link)

## If you'd like to run this application locally, please make sure to create a firebase-config.json file. If you'd prefer, I can email it to you. For security reasons, I'm not sharing API keys directly in this repository. If you don't create or obtain the configuration file (firebase-config.json), the backend services won't function properly. This file contains essential Firebase API keys and project details required to connect to the backend, handle authentication, database operations, and other Firebase features.

![Ekran görüntüsü 2025-01-29 151245](https://github.com/user-attachments/assets/755723c9-562a-4e6e-a159-d5494083a046)
![Ekran görüntüsü 2025-01-29 151306](https://github.com/user-attachments/assets/4a449a11-da39-464d-898c-a6124fba7a75)
![Ekran görüntüsü 2025-01-29 151330](https://github.com/user-attachments/assets/ce94be82-3362-45c9-b57e-2b97ccaf1e8b)
![Ekran görüntüsü 2025-01-29 151410](https://github.com/user-attachments/assets/5dcc37e8-5572-47bc-b414-391c6ebf72d3)
![Ekran görüntüsü 2025-01-29 151419](https://github.com/user-attachments/assets/dc3e0dc7-2e66-46b6-9c0d-a998a9b6177a)


## Project Overview

This is a microservices-based Doctor Appointment System designed to provide users with an efficient platform to book and manage appointments with doctors. The system consists of several backend services built with NestJS and a frontend developed using Next.js, Material UI (MUI), and Redux Toolkit.

---

## Features

### Backend

- **Microservices Architecture**:
  - **Auth Service**: Handles user authentication and authorization.
  - **User Service**: Manages user data and profile information.
  - **Doctor Service**: Manages doctor profiles, schedules, and appointment data.
- **Database**: Firebase Firestore for efficient, scalable data storage.
- **Authentication**: Secure user authentication powered by Firebase Auth.

### Frontend

- **Next.js**: For optimized frontend performance.
- **Material UI (MUI)**: Pre-styled components for a modern user interface created by Google.
- **Redux Toolkit**: Efficient state management for scalable applications.
- **Google Maps Integration**: Locate doctors easily by viewing their locations on an interactive map.

---

## Design, Assumptions, and Issues Encountered

### **Design Decisions**

- **Microservices Architecture:**  
  The backend was designed using a microservices architecture to ensure scalability, maintainability, and separation of concerns.
- **NestJS Framework:**  
  NestJS was chosen for its robust structure, dependency injection, and support for modular development.
- **Firebase Integration:**  
  Firebase Firestore was selected for real-time data handling and ease of integration with Firebase Auth for secure authentication.
- **Google Maps API:**  
  This was integrated to provide users with the ability to locate doctors visually on an interactive map.
- **Frontend Stack:**  
  Next.js was used for server-side rendering and optimized performance. Material UI provided ready-to-use components for modern UI, while Redux Toolkit handled efficient state management.

---

### **Assumptions Made**

1. **Doctor Information:**
   - Doctors will manually input their availability and location.
   - All doctor location coordinates are assumed to be accurate and valid for display on Google Maps.
2. **User Behavior:**
   - Users are assumed to have a stable internet connection for Firebase and Google Maps features.
3. **Authentication:**
   - Firebase Auth is assumed to handle secure login and user session management without additional backend complexity.
4. **Data Scalability:**
   - Firebase Firestore is assumed to scale efficiently as the user base grows.

---

### **Issues Encountered and Solutions**

1. **Cross-Origin Resource Sharing (CORS) Errors:**

   - Issue: Encountered during API requests between the frontend and backend.
   - Solution: Configured appropriate CORS headers in the backend services.

2. **Google Maps API Integration Challenges:**

   - Issue: Difficulties in rendering accurate locations.
   - Solution: Proper validation for input coordinates were implemented.

3. **Firebase Configuration Complexity:**

   - Issue: Initial complexity in setting up Firestore security rules and Auth flows.
   - Solution: Detailed security rules and user role-based authentication flow were established.

4. **State Management Complexity:**

   - Issue: Managing asynchronous operations with Redux Toolkit.
   - Solution: Integrated Redux Toolkit with async slices for efficient state management.

5. **User Experience (UX) Concerns:**
   - Issue: Initial cluttered UI due to dense form fields and data displays.
   - Solution: Leveraged Material UI components for cleaner and more user-friendly layouts.

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for backend setup)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure Firebase Firestore and Auth in the `.env` file.

5. Start the backend services:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env.local` file based on the provided example.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Usage

- Visit the frontend application in your browser at `http://localhost:3000`.
- Users can register, log in, and browse available doctors or _filter_ doctors.
- Doctors can see their appointments.
- Google Maps provides a visual representation of doctors' locations when users select any doctor as you wanted for the final homework.

---

## Project Structure

### Backend

- `auth/`: Authentication microservice
- `users/`: User microservice
- `doctors/`: Doctor microservice

### Frontend

- `components/`: Reusable UI components
- `app/`: Application routes
- `store/`: State management configuration

---

## Technologies Used

- **Backend**: NestJS, Firebase Firestore, Firebase Auth
- **Frontend**: Next.js, Material UI, Redux Toolkit
- **Others**: Google Maps API

---

## Contributing

Contributions are welcome! Please follow the standard fork, branch, commit, and pull request workflow.

---

## License

This project is licensed under the MIT License.
