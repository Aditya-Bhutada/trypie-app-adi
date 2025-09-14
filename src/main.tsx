
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import App from "./App";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import PlanTrip from "./pages/PlanTrip";
import Rewards from "./pages/Rewards";
import GroupInvitation from "./pages/GroupInvitation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OurStory from "./pages/OurStory";
import ContactUs from "./pages/ContactUs";
import TermsPrivacy from "./pages/TermsPrivacy";
import BecomePartner from "./pages/BecomePartner";
import Destinations from "./pages/Destinations";
import Reviews from "./pages/Reviews";
import Experiences from "./pages/Experiences";
import AIRecommendations from "./pages/AIRecommendations";
import InfluencerTrips from "./pages/InfluencerTrips";
import LongWeekends from "./pages/LongWeekends";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create the router first
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "/explore",
        element: <Explore />, // Remove the ProtectedRoute wrapper to allow all users to access
      },
      {
        path: "/groups",
        element: <ProtectedRoute><Groups /></ProtectedRoute>,
      },
      {
        path: "/groups/invitation",
        element: <GroupInvitation />,
      },
      {
        path: "/plan-trip",
        element: <ProtectedRoute><PlanTrip /></ProtectedRoute>,
      },
      {
        path: "/rewards",
        element: <ProtectedRoute><Rewards /></ProtectedRoute>,
      },
      {
        path: "/our-story",
        element: <OurStory />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/terms-privacy",
        element: <TermsPrivacy />,
      },
      {
        path: "/become-partner",
        element: <BecomePartner />,
      },
      {
        path: "/destinations",
        element: <Destinations />,
      },
      {
        path: "/reviews",
        element: <Reviews />,
      },
      {
        path: "/experiences",
        element: <Experiences />,
      },
      {
        path: "/ai-recommendations",
        element: <AIRecommendations />,
      },
      {
        path: "/influencer-trips",
        element: <InfluencerTrips />,
      },
      {
        path: "/long-weekends",
        element: <LongWeekends />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

// Render with correct provider hierarchy
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="trypie-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
