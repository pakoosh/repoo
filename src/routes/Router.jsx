import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Register } from "../pages/auth/Register";
import { Login } from "../pages/auth/Login";
import { NotFound } from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import withAuthRedirect from "./withAuthRedirect";
import { Settings } from "../pages/Settings";
import { Users } from "../pages/User";
import Dashboard from "../pages/Dashboard";
import { Devices } from "../pages/Devices";
import { Alerts } from "../pages/Alerts";


export default function Router() {
  const AuthRequiredLogin = withAuthRedirect(Login);
  return (
    <BrowserRouter>
      <Routes>
        {/* ------------ all those pages which not required authorization ----------------------- */}
        <Route path="/login" element={<AuthRequiredLogin />} />
        <Route element={<PrivateRoute />}>
          {/* ------------ all those pages which required authorization ----------------------- */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}