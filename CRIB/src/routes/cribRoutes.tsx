import CRIBLogin from "../Auth/crib-login";
import CRIBRegister from "../Auth/crib-register";
import AccountsTable from "../Pages/Bank/Accounts";
import ActivationReq from "../Pages/CRIB/activationReq";
import ReportApproval from "../Pages/CRIB/Report";
import GenerateReport from "../Pages/CRIB/generateReport";



export const cribRoutes = [
  { path: "/crib-requests", element: <ActivationReq/> },
  {path:"/crib-register", element:<CRIBRegister/>},
  {path:"/crib-login" , element:<CRIBLogin/>},
 {path:"/accounts" ,element:<AccountsTable/>},
 {path:"/reports" , element:<ReportApproval/>},
 {path:"/generate-report", element:<GenerateReport/>}



];
