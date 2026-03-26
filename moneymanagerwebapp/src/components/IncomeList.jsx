import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const IncomeList = ({ transactions, onDelete, onDownload, onEmail }) => {
    const [loading, setLoading] = useState(false);
    
    const handleEmail = async () => {
        setLoading(true);
        try{
            await onEmail();
        }finally{
            setLoading(false);
        }
    }
    
    const handleDownload = async() => {
        setLoading(true);
        try{
            await onDownload();
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Sources</h5>

                <div className="flex items-center justify-end gap-2">
                    <button 
                        disabled={loading}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
                        onClick={handleEmail}>
                        {loading ? (
                            <>
                               <LoaderCircle className="w-4 h-4 animate-spin"/>
                               Emailing...
                            </>
                        ):(
                            <>
                                <Mail size={15} className="text-green-500"/>
                                Email
                            </>
                        )}
                    </button>

                    <button 
                        disabled={loading} 
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
                        onClick={handleDownload}>
                        {loading ? (
                            <>
                               <LoaderCircle className="w-4 h-4 animate-spin"/>
                               Downloading...
                            </>
                        ):(
                            <>
                                <Download size={15} className="text-green-500"/>
                                Download
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions.length > 0 ? (
                    transactions.map((income) => (
                        <TransactionInfoCard
                            key={income.id}
                            title={income.name}
                            icon={income.icon}
                            date={moment(income.date).format("Do MMM YYYY")}
                            amount={income.amount}
                            type="income"
                            onDelete={() => onDelete(income.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">
                        No income records found.
                    </p>
                )}
            </div>

        </div>
    );
};

export default IncomeList;