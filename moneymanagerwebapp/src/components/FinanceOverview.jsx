import { addThousandsSeparator } from "../util/addThousandsSeparator";
import CustomPieChart from "./CustomPieChart";

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const COLORS = ['#4169E1', '#DC143C', '#228B22'];

  const balanceData = [
    { name: 'Total Balance', amount: totalBalance },
    { name: 'Total Expense', amount: totalExpense },
    { name: 'Total Income', amount: totalIncome },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      {/* Container for the donut chart */}
      <div className="w-full max-w-md mx-auto py-4">
        <CustomPieChart
          data={balanceData}
          colors={COLORS}
          centerLabel="Total Balance"
          centerAmount={`₹${addThousandsSeparator(totalBalance)}`}
        />
      </div>
    </div>
  );
};

export default FinanceOverview;