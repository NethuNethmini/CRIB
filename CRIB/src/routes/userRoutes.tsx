import BankDashboard from "../Pages/Bank/Dashboard";
import Verify from "../Pages/Customer/Verify";


export const userRoutes = [
  { path: "/", element: <BankDashboard /> },
  {path:"/cus-login", element: <Verify/>},
  {path:"/cus-register", element:<Verify/>}
];
