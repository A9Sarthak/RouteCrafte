import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateJourney from "./pages/CreateJourney";
import JourneyAnalytics from "./pages/JourneyAnalytics";
import JourneyTimeline from "./pages/JourneyTimeline";
import JourneySummary from "./pages/JourneySummary";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

import Navbar from "./components/Navbar";

import ProfileSettings from "./pages/ProfileSettings";
import GlobalOverview from "./pages/GlobalOverview";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfileSettings />
          </RequireAuth>
        }
      />
      <Route
        path="/overview"
        element={
          <RequireAuth>
            <GlobalOverview />
          </RequireAuth>
        }
      />

      <Route
        path="/plan"
        element={
          <RequireAuth>
            <CreateJourney />
          </RequireAuth>
        }
      />
      <Route
        path="/analytics"
        element={
          <RequireAuth>
            <JourneyAnalytics />
          </RequireAuth>
        }
      />
      <Route
        path="/timeline"
        element={
          <RequireAuth>
            <JourneyTimeline />
          </RequireAuth>
        }
      />
      <Route
        path="/summary"
        element={
          <RequireAuth>
            <JourneySummary />
          </RequireAuth>
        }
      />
      </Routes>
      </div>
    </>
  );
}

export default App;
