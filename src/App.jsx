import Dashboard from "./pages/User_Pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
   
    </>
  );
};
export default App;
