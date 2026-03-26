import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert =({content,onDelete}) => {
    const [loading,setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try{
            await onDelete();
        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <p className="text-sm">{content}</p>
               <div className="flex justify-end mt-6">
                  <button 
                  onClick={handleDelete}
                  disabled={loading}
                  type="button"
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-colors duration-200">

                    {loading ? (
                        <div className="flex items-center gap-2">
                            <LoaderCircle className="animate-spin w-5 h-5" />
                            Deleting...
                        </div>
                    ) : (
                        <>Delete</>
                    )}
                    
                  </button>
               </div>
        </div>
    )
}

export default DeleteAlert;