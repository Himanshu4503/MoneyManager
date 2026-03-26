// Timezone-safe date formatting
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Prepare data for Expense line chart
 * @param {Array} transactions - Array of ExpenseDTO
 */
export const prepareExpenseLineChartData = (transactions = []) => {
  if (!transactions || !transactions.length) {
    return {
      labels: [],
      datasets: [
        {
          label: "Expenses",
          data: [],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.25)",
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  }

  // Group expenses by date
  const grouped = {};
  transactions.forEach((tx) => {
    const date = formatDate(tx.date);
    const amount = Number(tx.amount) || 0;

    if (!grouped[date]) grouped[date] = 0;
    grouped[date] += amount;
  });

  // Sort dates chronologically
  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const data = labels.map((date) => grouped[date]);

  return {
    labels,
    datasets: [
      {
        label: "Expenses",
        data,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.25)",
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
};