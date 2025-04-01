import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Feedback from "./Views/Feedback/Feedback";
import Home from "./Views/Home/Home";
import CreateClass from "./Views/CreateClass/CreateClass";
import Appointment from "./Views/Appointment/Appointment";
import SignIn from "./Views/SingIn/SingIn";
import Login from "./Views/SingIn/Login";
import { NotFound } from "./GlobalVariables";
import Profile from "./Views/Profile/Profile";
import Users from "./Views/Users/Users";
import PrivateFeedback from "./Views/PrivateFeedback/PrivateFeedback";
import CreateService from "./Views/Services/CreateService";
import PurchaseHistory from "./Views/PurchaseHistory/PurchaseHistory";
import CreatePlan from "./Views/Plans/CreatePlan";
import HirePlan from "./Views/Plans/HirePlan";
import Request from "./Views/Plans/Requests";
import Metadata from "./Views/Profile/Profile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/Feedback" element={<Feedback />} />
            <Route path="/PrivateFeedback" element={<PrivateFeedback />} />
            <Route path="/CreateClass" element={<CreateClass />} />
            <Route path="/AppointmentForm" element={<Appointment />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/LogIn" element={<Login />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/CreateService" element={<CreateService />} />
            <Route path="/PurchaseHistory" element={<PurchaseHistory />} />
            <Route path="/CreatePlan" element={<CreatePlan />} />
            <Route path="/HirePlan" element={<HirePlan />} />
            <Route path="/Requests" element={<Request />} />
            <Route path="/Metadata" element={<Metadata />} />

            <Route
              path="*"
              element={<NotFound mensaje="La página que busca no existe" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
