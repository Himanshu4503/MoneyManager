import { useEffect, useState } from "react";
import Input from "./Input";
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({ onAddCategory, intialCategoryData, isEditing}) => {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(isEditing && intialCategoryData){
        setCategory(intialCategoryData)
    }else{
        setCategory({name:"",type:"income",icon:""});
    }
  },[isEditing,intialCategoryData])

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const handleChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const handleSubmit = async () => {
    if (!category.name) return; // simple validation
    setLoading(true);
    try {
      await onAddCategory(category);
      setCategory({ name: "", type: "income", icon: "" }); // reset form after add
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Emoji Picker */}
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Category Name */}
      <Input
        value={category.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Category Name"
        placeholder="e.g., Freelance, Salary, Groceries"
        type="text"
      />

      {/* Category Type */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Category Type
        </label>
        <select
          value={category.type}
          onChange={({ target }) => handleChange("type", target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {categoryTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !category.name}
          className={`px-5 py-2.5 rounded-md font-semibold shadow text-white transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
             {isEditing ? "Updating": " Adding..."}
            </>
          ) : (
            <>
            {isEditing ? "Update Category" : "Add Category"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
