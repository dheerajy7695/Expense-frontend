import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../Services/transactionsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Dashboard = () => {
  const FIXED_COLORS = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#4a235a", "#1abc9c", "#c0392b", "#7d3c98", "#2471a3",
    "#2e4053", "#117864", "#b9770e", "#239b56", "#a93226",
  ];

  const categories = [
    "Groceries", "Salary / Wages", "Rent / Mortgage", "Shopping / Clothing",
    "Utilities", "Internet / Phone", "Transportation", "Maintenance / Repairs",
    "Medical / Health", "Education / Childcare", "Entertainment / Subscriptions",
    "Hobbies / Leisure", "Travel / Vacations", "Gifts / Donations",
    "Office Supplies", "Training / Courses", "Emergency Fund",
    "Investments", "Retirement Contributions", "Other",
  ];

  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    date: "",
    category: categories[0],
    transactionType: "income",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTrans, setDeleteTrans] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showPercent, setShowPercent] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const user = await JSON.parse(sessionStorage.getItem("user"));
      setLoggedInUser(user);
      const data = await getTransactions({ userId: user._id });
      if (data && Array.isArray(data.transactions)) setTransactions(data.transactions);
      else setTransactions([]);
    } catch (error) {
      toast.error(error.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setFormData(transactions[index]);
      setEditingIndex(index);
    } else {
      setFormData({
        title: "",
        amount: "",
        description: "",
        date: "",
        category: categories[0],
        transactionType: "income",
      });
      setEditingIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return toast.error("User not logged in");
    setLoading(true);
    formData.userId = loggedInUser._id;
    try {
      if (formData?._id) await updateTransaction(formData._id, formData);
      else await createTransaction(formData);
      toast.success(editingIndex !== null ? "Updated!" : "Added!");
      loadTransactions();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (data) => {
    setDeleteTrans(data);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTrans(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTrans?._id) return;
    setLoading(true);
    try {
      await deleteTransaction(deleteTrans._id);
      toast.success("Deleted successfully!");
      loadTransactions();
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filterType === "all"
    ? transactions
    : transactions.filter((t) => t.transactionType === filterType);

  const totalIncome = transactions.filter(t => t.transactionType === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.transactionType === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const totalCount = transactions.length;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);
  transactions.forEach(t => {
    const month = new Date(t.date).getMonth();
    t.transactionType === "income" ? monthlyIncome[month] += Number(t.amount) : monthlyExpense[month] += Number(t.amount);
  });

  const monthlyChartData = {
    labels: months,
    datasets: [
      { label: "Income", data: monthlyIncome, backgroundColor: "#22c55e" },
      { label: "Expense", data: monthlyExpense, backgroundColor: "#ef4444" },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeOutQuart" },
    plugins: { legend: { position: "top" }, title: { display: true, text: "Monthly Income vs Expense" } },
  };

  const categoryIncome = {};
  const categoryExpense = {};
  categories.forEach(cat => (categoryIncome[cat] = 0, categoryExpense[cat] = 0));
  transactions.forEach(t => {
    t.transactionType === "income" ? categoryIncome[t.category] += Number(t.amount) : categoryExpense[t.category] += Number(t.amount);
  });

  const incomeCategories = Object.keys(categoryIncome).filter(cat => categoryIncome[cat] > 0);
  const incomeValues = incomeCategories.map(cat => categoryIncome[cat]);
  const expenseCategories = Object.keys(categoryExpense).filter(cat => categoryExpense[cat] > 0);
  const expenseValues = expenseCategories.map(cat => categoryExpense[cat]);

  const incomeChartData = {
    labels: incomeCategories,
    datasets: [{ data: incomeValues, backgroundColor: incomeCategories.map((_, idx) => FIXED_COLORS[idx % FIXED_COLORS.length]) }],
  };
  const expenseChartData = {
    labels: expenseCategories,
    datasets: [{ data: expenseValues, backgroundColor: expenseCategories.map((_, idx) => FIXED_COLORS[(idx + 5) % FIXED_COLORS.length]) }],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { animateScale: true, animateRotate: true, duration: 1400, easing: "easeOutBounce" },
    plugins: {
      legend: { position: "right" },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (value, ctx) => showPercent ? ((value / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1) + "%" : value,
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: $${ctx.raw} (${((ctx.raw / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  const getMessage = () => {
    if (balance > 1000) return "Great job! You're saving well 💪";
    if (balance > 0) return "You're doing good! Keep tracking 📈";
    if (balance === 0) return "Break-even. Plan better!";
    return "Uh-oh! Overspending. Time to save 💡";
  };

  return (
    <div className={`relative min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-spin-slow absolute w-72 h-72 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-30 top-[-100px] left-[-100px]"></div>
        <div className="animate-spin-slow-slow absolute w-96 h-96 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full opacity-20 bottom-[-150px] right-[-150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2 md:gap-0">
          <h2 className="text-2xl font-bold">Transaction Dashboard</h2>
          <p className="text-center italic mb-4 text-gray-500">{getMessage()}</p>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 rounded bg-gray-800 text-white w-full md:w-auto">{darkMode ? "Light Mode" : "Dark Mode"}</button>
            <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto">Add Transaction</button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 bg-gradient-to-r from-green-400 to-green-600 p-4 rounded shadow text-white flex flex-col items-center">
            <p>Total Income</p>
            <p className="text-xl font-bold">${totalIncome}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-red-400 to-red-600 p-4 rounded shadow text-white flex flex-col items-center">
            <p>Total Expense</p>
            <p className="text-xl font-bold">${totalExpense}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded shadow text-white flex flex-col items-center">
            <p>Balance</p>
            <p className="text-xl font-bold">${balance}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded shadow text-white flex flex-col items-center">
            <p>Total Transactions</p>
            <p className="text-xl font-bold">{totalCount}</p>
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Monthly Income vs Expense */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full h-64 md:h-80 lg:h-96 flex flex-col">
            <h3 className="text-lg font-bold mb-2">Monthly Income vs Expense</h3>
             <div className="chart-container flex-1">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>

          {/* Income by Category */}
          {incomeValues.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full h-64 md:h-80 lg:h-96 flex flex-col">
              <h3 className="text-lg font-bold mb-2">Income by Category</h3>
              <div className="chart-container flex-1">
                <Doughnut data={incomeChartData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {/* Expense by Category */}
          {expenseValues.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full h-64 md:h-80 lg:h-96 flex flex-col">
              <h3 className="text-lg font-bold mb-2">Expense by Category</h3>
              <div className="chart-container flex-1">
                <Doughnut data={expenseChartData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {/* Transaction Type Distribution */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full h-64 md:h-80 lg:h-96 flex flex-col">
            <h3 className="text-lg font-bold mb-2">Transaction Type Distribution</h3>
            <div className="chart-container flex-1">
              <Doughnut
                data={{
                  labels: ["Income", "Expense"],
                  datasets: [{
                    data: [totalIncome, totalExpense],
                    backgroundColor: ["#22c55e", "#ef4444"],
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right" },
                    datalabels: {
                      color: "#fff",
                      font: { weight: "bold", size: 12 },
                      formatter: (value, ctx) =>
                        showPercent
                          ? ((value / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1) + "%"
                          : value,
                    },
                    tooltip: {
                      callbacks: {
                        label: ctx => `${ctx.label}: $${ctx.raw} (${((ctx.raw / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`,
                      },
                    },
                  },
                  animation: { animateScale: true, animateRotate: true, duration: 1400, easing: "easeOutBounce" },
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter & Table */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto">
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">Add Transaction</button>
        </div>

        {/* TABLE (desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className={`min-w-full border divide-y divide-gray-200 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => (
                <tr key={idx} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className="py-2 px-4 border-b">{txn.title}</td>
                  <td className={`py-2 px-4 border-b ${txn.transactionType === "income" ? "text-green-600" : "text-red-600"}`}>${txn.amount}</td>
                  <td className="py-2 px-4 border-b">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{txn.category}</td>
                  <td className="py-2 px-4 border-b">{txn.transactionType}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button onClick={() => openModal(idx)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => openDeleteModal(txn)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr><td colSpan="6" className="text-center py-4 italic">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden">
          {filteredTransactions.map((txn, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{txn.title}</span>
                <span className={txn.transactionType === "income" ? "text-green-600" : "text-red-600"}>${txn.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{new Date(txn.date).toLocaleDateString()}</span>
                <span>{txn.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="capitalize">{txn.transactionType}</span>
                <div className="space-x-2">
                  <button onClick={() => openModal(idx)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                  <button onClick={() => openDeleteModal(txn)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <p className="text-center italic text-gray-500">No transactions found.</p>
          )}
        </div>
      </div>

      {/* MODALS (Add/Edit & Delete) */}
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className={`w-full max-w-md md:max-w-lg lg:max-w-xl p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
            <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? "Edit Transaction" : "Add Transaction"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              </select>
              <select name="transactionType" value={formData.transactionType} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={3}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editingIndex !== null ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className={`w-full max-w-sm p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete "{deleteTrans?.title}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={closeDeleteModal} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
