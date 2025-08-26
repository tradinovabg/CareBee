import Home from "./pages/Home";
import Sos from "./pages/Sos";
import Contacts from "./pages/Contacts";

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/sos" element={<Sos />} />
  <Route path="/contacts" element={<Contacts />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
