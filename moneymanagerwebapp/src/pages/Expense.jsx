import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import UseUser from "../hooks/UseUser";
import axiosConfig from "../util/AxiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import ExpenseList from "../components/ExpenseList";
import Modal from "../components/Modal";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import ExpenseOverview from "../components/ExpenseOverview";
import toast from "react-hot-toast";

const Expense = () => {
  UseUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  // Fetch all expenses
  const fetchExpenseDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch expense details.", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for expenses
  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch expense categories:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense categories");
    }
  };

  // Add a new expense (optimistic UI update)
  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) return toast.error("Please enter a name");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount should be > 0");
    if (!date) return toast.error("Please select a date");
    if (date > new Date().toISOString().split("T")[0]) return toast.error("Date cannot be in the future");
    if (!categoryId) return toast.error("Please select a category");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });

      if (response.status === 201) {
        setOpenAddExpenseModal(false);
        toast.success("Expense added successfully");
        setExpenseData((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error adding expense", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      setExpenseData((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // Download expense Excel
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // ✅ Added cleanup
      toast.success("Expense Excel downloaded");
    } catch (error) {
      console.error("Failed to download expense Excel", error);
      toast.error(error.response?.data?.message || "Failed to download expense Excel");
    }
  };

  // Email expense Excel
  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE_DOWNLOAD, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // ✅ Added cleanup
      toast.success("Expense Excel downloaded");
    } catch (error) {
      console.error("Failed to email/download expense Excel", error);
      toast.error("Failed to download expense Excel");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            onEmail={handleEmailExpenseDetails}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm
              onAddExpense={handleAddExpense}
              categories={categories}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;