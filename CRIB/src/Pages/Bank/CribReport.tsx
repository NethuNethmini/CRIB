import React, { useState } from 'react';
import { Search, User, Building2, CreditCard, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppSelector } from '../../Store/hooks';

const apiUrl: string = import.meta.env.VITE_API_URL;

interface PaymentHistory {
    paymentId: string;
    date: string;
    amount: number;
    status: number;
}

interface CreditFacility {
    facilityId: string;
    cribUsernic: string;
    licenseNumber: string;
    institution: string;
    facilityType: string;
    loanAmount: number;
    outstandingBalance: number;
    status: number;
    openedDate: string;
    closedDate: string;
    paymentHistory: PaymentHistory[];
    creator: string;
}

interface CribAccountDetails {
    nic: string;
    cribId: string;
    fullName: string;
    dateOfBirth: string;
    isActive: boolean;
    phoneNumber: string;
    email: string;
    nicFrontCid: string;
    nicBackCid: string;
    createdBy: string;
    createdAt: string;
    creator: string;
}

interface CribReport {
    cribAccountDetails: CribAccountDetails;
    creditFacilities: CreditFacility[];
    totalFacilities: number;
    activeFacilities: number;
    closedFacilities: number;
    totalLoanAmount: number;
    totalOutstanding: number;
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
    onTimePaymentRatio: number;
    creditScore: number;
}

interface ApiResponse {
    status: string;
    code: number;
    message: string;
    cribReport: CribReport;
    requestId: string;
    timestamp: string;
}

const CribReportViewer: React.FC = () => {
    const [nic, setNic] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankId, setBankId] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState('');
      const token = useAppSelector((state) => state.auth.auth);

    const handleSubmit = async () => {
        if (!nic || !bankName || !bankId) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        

        try {
            // Simulated API call - replace with your actual endpoint
            const res = await fetch(apiUrl + `bank/get/crib/report?bankId=${bankId}&bankName=${bankName}&nic=${nic}`, {
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })

            if(res.ok){
                const data = await res.json()
                console.log(data)
                setReportData(data);
            }
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock data - replace with actual API call
            // const mockData: ApiResponse = {
            //     status: "success",
            //     code: 200,
            //     message: "CRIB report retrieved successfully",
            //     cribReport: {
            //         cribAccountDetails: {
            //             nic: nic || "499012345678",
            //             cribId: "CRIB-499012345678",
            //             fullName: "Sahan Perera",
            //             dateOfBirth: "1990-01-31",
            //             isActive: true,
            //             phoneNumber: "+94771234567",
            //             email: "sahan.perera@example.com",
            //             nicFrontCid: "bafybeifrontniccidexample",
            //             nicBackCid: "bafybeibackniccidexample",
            //             createdBy: bankId || "ICC900001",
            //             createdAt: "2025-11-08T05:58:20Z",
            //             creator: ""
            //         },
            //         creditFacilities: [
            //             {
            //                 facilityId: "1093dbe5-e207-469e-86a8-47afdc1ecda5",
            //                 cribUsernic: nic || "499012345678",
            //                 licenseNumber: bankId || "ICC900001",
            //                 institution: bankName || "Acme Bank PLC",
            //                 facilityType: "PERSONAL_LOAN",
            //                 loanAmount: 500000,
            //                 outstandingBalance: 500000,
            //                 status: 1,
            //                 openedDate: "2024-04-10",
            //                 closedDate: "2025-03-09",
            //                 paymentHistory: [
            //                     {
            //                         paymentId: "",
            //                         date: "2024-05-10",
            //                         amount: 25000,
            //                         status: 1
            //                     }
            //                 ],
            //                 creator: "cosmos1hyq02yp8rk738sgv05xd4hspzuh4uyutuq3qhg"
            //             },
            //             {
            //                 facilityId: "2e8931f3-9bf3-42bb-be0e-d86f62e721e1",
            //                 cribUsernic: nic || "499012345678",
            //                 licenseNumber: bankId || "ICC900001",
            //                 institution: bankName || "Acme Bank PLC",
            //                 facilityType: "HOME_LOAN",
            //                 loanAmount: 800000,
            //                 outstandingBalance: 750000,
            //                 status: 1,
            //                 openedDate: "2024-04-10",
            //                 closedDate: "2025-03-09",
            //                 paymentHistory: [
            //                     {
            //                         paymentId: "",
            //                         date: "2024-05-10",
            //                         amount: 50000,
            //                         status: 1
            //                     }
            //                 ],
            //                 creator: "cosmos1hyq02yp8rk738sgv05xd4hspzuh4uyutuq3qhg"
            //             }
            //         ],
            //         totalFacilities: 2,
            //         activeFacilities: 2,
            //         closedFacilities: 0,
            //         totalLoanAmount: 1300000,
            //         totalOutstanding: 1250000,
            //         onTimePayments: 2,
            //         latePayments: 0,
            //         missedPayments: 0,
            //         onTimePaymentRatio: 100,
            //         creditScore: 820
            //     },
            //     requestId: "req-499012345678",
            //     timestamp: "2025-11-08T08:39:32Z"
            // };

           
        } catch (err) {
            setError('Failed to fetch CRIB report. Please try again.');
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1"><CheckCircle size={14} /> Active</span>;
            case 0:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1"><XCircle size={14} /> Closed</span>;
            default:
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1"><AlertCircle size={14} /> Defaulted</span>;
        }
    };

    const getPaymentStatusBadge = (status: number) => {
        return status === 1 ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Paid</span>
        ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending</span>
        );
    };

    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCreditScoreColor = (score: number) => {
        if (score >= 800) return 'text-green-600';
        if (score >= 700) return 'text-blue-600';
        if (score >= 600) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 w-full flex justify-center bg-gray-50 min-h-screen">
            <div className="flex-1 flex flex-col overflow-hidden max-w-5xl">
                <main className="flex-1 space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-black mb-2">CRIB Report Viewer</h1>
                        <p className="text-gray-600">Enter user details to retrieve credit report</p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">NIC Number</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={nic}
                                            onChange={(e) => setNic(e.target.value)}
                                            placeholder="499012345678"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bank Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            placeholder="Acme Bank PLC"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bank ID</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={bankId}
                                            onChange={(e) => setBankId(e.target.value)}
                                            placeholder="ICC900001"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-2 bg-main text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Clock className="animate-spin" size={18} />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Search size={18} />
                                            Search Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Report Display */}
                    {reportData && (
                        <>
                            {/* Account Overview */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <User className="text-blue-600" />
                                    Account Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Full Name</p>
                                            <p className="text-lg font-semibold">{reportData.cribReport.cribAccountDetails.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">NIC</p>
                                            <p className="text-lg font-semibold">{reportData.cribReport.cribAccountDetails.nic}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date of Birth</p>
                                            <p className="text-lg font-semibold">{formatDate(reportData.cribReport.cribAccountDetails.dateOfBirth)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="text-lg font-semibold">{reportData.cribReport.cribAccountDetails.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone Number</p>
                                            <p className="text-lg font-semibold">{reportData.cribReport.cribAccountDetails.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">CRIB ID</p>
                                            <p className="text-lg font-semibold">{reportData.cribReport.cribAccountDetails.cribId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Score & Stats */}
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
                                    <TrendingUp className={`mx-auto mb-2 ${getCreditScoreColor(reportData.cribReport.creditScore)}`} size={32} />
                                    <p className="text-sm text-gray-600 mb-1">Credit Score</p>
                                    <p className={`text-3xl font-bold ${getCreditScoreColor(reportData.cribReport.creditScore)}`}>
                                        {reportData.cribReport.creditScore}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <p className="text-sm text-gray-600 mb-2">Total Facilities</p>
                                    <p className="text-3xl font-bold text-gray-800">{reportData.cribReport.totalFacilities}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {reportData.cribReport.activeFacilities} Active, {reportData.cribReport.closedFacilities} Closed
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <p className="text-sm text-gray-600 mb-2">Total Loan Amount</p>
                                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(reportData.cribReport.totalLoanAmount)}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <p className="text-sm text-gray-600 mb-2">Outstanding Balance</p>
                                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.cribReport.totalOutstanding)}</p>
                                </div>
                            </div>

                            {/* Payment Performance */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Performance</h2>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">On-Time Payments</p>
                                        <p className="text-2xl font-bold text-green-600">{reportData.cribReport.onTimePayments}</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Late Payments</p>
                                        <p className="text-2xl font-bold text-yellow-600">{reportData.cribReport.latePayments}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Missed Payments</p>
                                        <p className="text-2xl font-bold text-red-600">{reportData.cribReport.missedPayments}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">On-Time Ratio</p>
                                        <p className="text-2xl font-bold text-blue-600">{reportData.cribReport.onTimePaymentRatio}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Facilities */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <CreditCard className="text-blue-600" />
                                    Credit Facilities
                                </h2>
                                <div className="space-y-6">
                                    {reportData.cribReport.creditFacilities.map((facility) => (
                                        <div key={facility.facilityId} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{facility.institution}</h3>
                                                    <p className="text-sm text-gray-600">{facility.facilityType.replace('_', ' ')}</p>
                                                </div>
                                                {getStatusBadge(facility.status)}
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Loan Amount</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(facility.loanAmount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Outstanding Balance</p>
                                                    <p className="text-lg font-semibold text-orange-600">{formatCurrency(facility.outstandingBalance)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">License Number</p>
                                                    <p className="text-lg font-semibold">{facility.licenseNumber}</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Opened Date</p>
                                                    <p className="font-medium">{formatDate(facility.openedDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Closed Date</p>
                                                    <p className="font-medium">{formatDate(facility.closedDate)}</p>
                                                </div>
                                            </div>

                                            {facility.paymentHistory.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <h4 className="font-semibold mb-3 text-gray-700">Payment History</h4>
                                                    <div className="space-y-2">
                                                        {facility.paymentHistory.map((payment, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                                                                <div className="flex gap-4">
                                                                    <span className="text-sm font-medium">{formatDate(payment.date)}</span>
                                                                    <span className="text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                                                                </div>
                                                                {getPaymentStatusBadge(payment.status)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CribReportViewer;