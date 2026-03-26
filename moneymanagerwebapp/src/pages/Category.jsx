import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import UseUser from '../hooks/UseUser';
import { Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import axiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';

const Category = () => {
  UseUser();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  // Add new category
  const handleAddCategory = async (category) => {
    const { name, type, icon } = category;

    if (!name.trim()) {
      toast.error("Category Name is required");
      return;
    }

    // Duplicate check
    const isDuplicate = categoryData.some(category =>
      category.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Category Name already exists");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, { name, type, icon });
      if (response.status === 201) {
        toast.success("Category added successfully");
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || "Failed to add category.");
    }
  };

  // Edit category (placeholder)
  const handleEditCategory = (categoryToEdit) => {
    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModal(true);
  };

  const handleUpdateCategory = async (updatedCategory) =>{
    const {id,name,type,icon} = updatedCategory;
    if(!name.trim()){
      toast.error("Category Name is required");
      return;
    }

    if(!id){
      toast.error("Category ID is missing for update");
      return;
    }

    try {
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id),{name,type,icon})
      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success("Category updated Successfully");
      fetchCategoryDetails();
    } catch (error) {
      console.error('Error updating category:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to update category.");
    }
  }
  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto max-w-4xl">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <button
            onClick={() => setOpenAddCategoryModal(true)}
            className="flex items-center gap-2 border border-green-200 px-3 py-1 rounded-md hover:bg-green-50 transition focus:outline-none focus:ring-0 text-green-600"
          >
            <Plus size={15} className="text-green-600" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Category List */}
        <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />

        {/* Add Category Modal */}
        <Modal
          isOpen={openAddCategoryModal}
          onClose={() => setOpenAddCategoryModal(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Modal>
        {/* Updating category modal */}
        <Modal
          onClose={() => {
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
          }}
          isOpen={openEditCategoryModal}
          title="Update Category"
        >
          <AddCategoryForm
            intialCategoryData={selectedCategory}
            onAddCategory={handleUpdateCategory} 
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Category;
