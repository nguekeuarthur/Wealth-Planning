import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./pages/Admin/Dashboard";
import PatrimoineOverview from "./pages/Admin/PatrimoineOverview";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import AllProjects from "./pages/Admin/AllProjects";
import ArchivedProjects from "./pages/Admin/ArchivedProjects";
import ProjectDetails from "./pages/Admin/ProjectDetails";
import ClientDetails from "./pages/Admin/ClientDetails";
import UserManagement from "./pages/Admin/UserManagement";
import DeletedUsers from "./pages/Admin/DeletedUsers";
import TeamMemberDetails from "./pages/Admin/TeamMemberDetails";
import AllInvoices from "./pages/Admin/AllInvoices";
import AllContracts from "./pages/Admin/AllContracts";
import AllNotifications from "./pages/Admin/AllNotifications";
import ProfileCompletion from "./pages/Auth/ProfileCompletion";
import AllTeams from "./pages/Admin/AllTeams";

import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import Chat from "./pages/User/Chat";
import ClientDashboard from "./pages/Client/ClientDashboard";
import PartnerDashboard from "./pages/Partner/PartnerDashboard";
import CollaboratorDashboard from "./pages/Collaborator/CollaboratorDashboard";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ChatLayout from "./components/layouts/ChatLayout";

// Landing Pages
import Home from "./pages/Landing/Home";
import About from "./pages/Landing/About";
import Services from "./pages/Landing/Services";
import Contact from "./pages/Landing/Contact";
import PublicLayout from "./components/layouts/PublicLayout";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <div>
          <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes avec Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth Routes (Connexion) */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/profile-completion" element={<ProfileCompletion />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/patrimoine" element={<PatrimoineOverview />} />
              <Route path="/admin/projects" element={<AllProjects />} />
              <Route path="/admin/projects/archived" element={<ArchivedProjects />} />
              <Route path="/admin/project/:id" element={<ProjectDetails />} />
              <Route path="/admin/client/:id" element={<ClientDetails />} />
              <Route path="/admin/team" element={<UserManagement />} />
              <Route path="/admin/deleted-users" element={<DeletedUsers />} />
              <Route path="/admin/team/:id" element={<TeamMemberDetails />} />
              <Route path="/admin/chat" element={<ChatLayout><Chat /></ChatLayout>} />
              <Route path="/admin/invoices" element={<AllInvoices />} />
              <Route path="/admin/contracts" element={<AllContracts />} />
              <Route path="/admin/notifications" element={<AllNotifications />} />
              <Route path="/admin/teams" element={<AllTeams />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin", "member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              />
              <Route path="/user/chat" element={<ChatLayout><Chat /></ChatLayout>} />
              <Route path="/user/notifications" element={<AllNotifications />} />
            </Route>

            {/* Client Routes - Accès à projets, factures, tâches, milestones, documents tagés client, messages */}
            <Route element={<PrivateRoute allowedRoles={["client"]} />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/projects" element={<AllProjects />} />
              <Route path="/client/project/:id" element={<ProjectDetails />} />
              <Route path="/client/tasks" element={<MyTasks />} />
              <Route path="/client/task-details/:id" element={<ViewTaskDetails />} />
              <Route path="/client/chat" element={<DashboardLayout activeMenu="Messagerie" fullWidth={true}><Chat /></DashboardLayout>} />
              <Route path="/client/invoices" element={<AllInvoices />} />
              <Route path="/client/documents" element={<AllInvoices />} />
              <Route path="/client/messages" element={<AllNotifications />} />
            </Route>

            {/* Partner Routes - Accès à messages (admin+collaborateur), tâches, milestones, documents tagés partenaire */}
            <Route element={<PrivateRoute allowedRoles={["partner"]} />}>
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />
              <Route path="/partner/projects" element={<AllProjects />} />
              <Route path="/partner/project/:id" element={<ProjectDetails />} />
              <Route path="/partner/tasks" element={<MyTasks />} />
              <Route path="/partner/task-details/:id" element={<ViewTaskDetails />} />
              <Route path="/partner/chat" element={<DashboardLayout activeMenu="Messagerie" fullWidth={true}><Chat /></DashboardLayout>} />
              <Route path="/partner/documents" element={<AllInvoices />} />
              <Route path="/partner/messages" element={<AllNotifications />} />
            </Route>

            {/* Collaborator Routes - Accès à tout sauf modification factures */}
            <Route element={<PrivateRoute allowedRoles={["collaborator"]} />}>
              <Route path="/collaborator/dashboard" element={<CollaboratorDashboard />} />
              <Route path="/collaborator/projects" element={<AllProjects />} />
              <Route path="/collaborator/project/:id" element={<ProjectDetails />} />
              <Route path="/collaborator/tasks" element={<MyTasks />} />
              <Route path="/collaborator/task-details/:id" element={<ViewTaskDetails />} />
              <Route path="/collaborator/chat" element={<DashboardLayout activeMenu="Messagerie" fullWidth={true}><Chat /></DashboardLayout>} />
              <Route path="/collaborator/invoices" element={<AllInvoices />} />
              <Route path="/collaborator/documents" element={<AllInvoices />} />
              <Route path="/collaborator/messages" element={<AllNotifications />} />
            </Route>
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
