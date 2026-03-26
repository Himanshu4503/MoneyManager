import { useEffect, useState } from "react";
import { prepareIncomeLineChartData } from "../util/prepareIncomeLineChartData";
import { Plus } from "lucide-react";
import CustomLineChart from "./CustomLineChart";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Income",
        data: [],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.25)",
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  });

  useEffect(() => {
    const result = prepareIncomeLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-1">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button
          onClick={onAddIncome}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg shadow hover:bg-green-200 transition-colors duration-200"
        >
          <Plus size={16} className="text-green-800" />
          Add Income
        </button>
      </div>

      <div className="mt-10">
        {chartData.datasets[0].data.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-center text-gray-400">No income data available.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;
