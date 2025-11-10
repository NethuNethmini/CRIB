import Login from "../Auth/login";
import Register from "../Auth/register";
import Facilities from "../Pages/Bank/Facilities";
import AddUserForm from "../Pages/Bank/createCRIBAccount";
import CRIBProfileSearch from "../Pages/Bank/customer";
import CustomerProfile from "../Pages/Bank/customerProfile";
import AccountsTable from "../Pages/Bank/Accounts";
import CribReportViewer from "../Pages/Bank/CribReport";


export const bankRoutes = [
  { path: "/bank-login", element: <Login /> },
  {path:"/bank-register" , element:<Register/>},
  {path:"/facilities", element:<Facilities/>},
  {path:"/search-profile" , element:<CRIBProfileSearch/>},
  {path:"/profile", element:<CustomerProfile/>},
  {path:"/accounts" ,element:<AccountsTable/>},
  // {path:"/dashboard", element:<Dashboard/>},
  {path:"/create-account" , element:<AddUserForm/>},
  { path: "/crib-report", element: <CribReportViewer /> }
  

];
