import CRIBLogin from "../Auth/crib-login";
import CRIBRegister from "../Auth/crib-register";
import ActivationReq from "../Pages/CRIB/activationReq";



export const cribRoutes = [
  { path: "/crib-requests", element: <ActivationReq/> },
  {path:"/crib-register", element:<CRIBRegister/>},
  {path:"/crib-login" , element:<CRIBLogin/>}

];
