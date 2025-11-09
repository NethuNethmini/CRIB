import Login from "../Auth/login";
import Register from "../Auth/register";
import Facilities from "../Pages/Bank/Facilities";
import AddUserForm from "../Pages/Bank/createCRIBAccount";
import CRIBProfileSearch from "../Pages/Bank/customer";
import CustomerProfile from "../Pages/Bank/customerProfile";


export const bankRoutes = [
  { path: "/bank-login", element: <Login /> },
  {path:"/bank-register" , element:<Register/>},
  {path:"/facilities", element:<Facilities/>},
  {path:"/search-profile" , element:<CRIBProfileSearch/>},
  {path:"/profile", element:<CustomerProfile/>},
  // {path:"/dashboard", element:<Dashboard/>},
  {path:"/create-account" , element:<AddUserForm/>}
  

];
