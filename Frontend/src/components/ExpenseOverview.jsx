import { useEffect, useState } from "react";
import { prepareExpenseLineChartData } from "../util/prepareExpenseLineChartData";
import { Plus } from "lucide-react";
import CustomLineChart from "./CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Expenses",
        data: [],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.25)",
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  });

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-1">
            Monitor your spending habits and track expense trends over time.
          </p>
        </div>

        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg shadow hover:bg-red-200 transition-colors duration-200"
        >
          <Plus size={16} className="text-red-800" />
          Add Expense
        </button>
      </div>

      <div className="mt-10">
        {chartData.datasets[0].data.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-center text-gray-400">No expense data available.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
