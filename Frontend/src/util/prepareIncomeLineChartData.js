const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const prepareIncomeLineChartData = (incomeData = []) => {
  if (!incomeData || !incomeData.length) {
    return {
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
    };
  }

  // Group incomes by date
  const grouped = {};
  incomeData.forEach((income) => {
    const date = formatDate(income.date);
    const amount = Number(income.amount) || 0;

    if (!grouped[date]) grouped[date] = 0;
    grouped[date] += amount;
  });

  // Sort dates chronologically (more robust)
  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const data = labels.map((date) => grouped[date]);

  return {
    labels,
    datasets: [
      {
        label: "Income",
        data,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.25)",
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
};