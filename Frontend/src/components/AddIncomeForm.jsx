import { useEffect, useState } from "react"
import EmojiPickerPopup from "./EmojiPickerPopup"
import Input from "./Input"
import { LoaderCircle } from "lucide-react"

const AddIncomeForm = ({ onAddIncome, categories }) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: ''
    })

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income)
        } finally {
            setLoading(false);
        }
    }

    useEffect (() => {
        if(categories.length > 0 && !income.categoryId){
            setIncome((prev) => ({...prev,categoryId:categories[0].id}))
        }
    }, [categories]) 

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon => handleChange('icon', selectedIcon))}
            />
            <Input
                value={income.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Income Source"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text" />

            <Input
                label="Category"
                value={income.categoryId}
                onChange={({ target }) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange('amount', target.value)}
                label="amount"
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange('date', target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAddIncome}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-colors duration-200"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <LoaderCircle className="animate-spin w-5 h-5" />
                            Adding...
                        </div>
                    ) : (
                        <>Add Income</>
                    )}

                </button>
            </div>


        </div>
    )
}

export default AddIncomeForm
