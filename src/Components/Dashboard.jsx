import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

import { toast } from "react-toastify";

import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../Services/transactionsService";

const Dashboard = () => {

  const FIXED_COLORS = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#4a235a", "#1abc9c", "#c0392b", "#7d3c98", "#2471a3",
    "#2e4053", "#117864", "#b9770e", "#239b56", "#a93226"
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
    userId: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTrans, setDeleteTrans] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState("");
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

      let requestData = { userId: user._id };

      const data = await getTransactions(requestData);
      if (data && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
        setError("No Transactions found.");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch transactions. Please try again.");
    }
  };

  const refreshFn = () => loadTransactions();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    formData.userId = loggedInUser._id;
    try {
      if (formData?._id) {
        const updatedTrans = await updateTransaction(formData._id, formData);
        loadTransactions();
        toast.success("Transaction updated successfully!");
      } else {
        const newTransaction = await createTransaction(formData);
        loadTransactions();
        toast.success("Transaction created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      toast.success("Transaction deleted successfully!");
      setIsDeleteModalOpen(false);
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message || "Failed to delete transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filterType === "all" ? transactions : transactions.filter((t) => t.transactionType === filterType);

  const totalIncome = transactions.filter((t) => t.transactionType === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.transactionType === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.getMonth();
    if (t.transactionType === "income") monthlyIncome[month] += Number(t.amount);
    else monthlyExpense[month] += Number(t.amount);
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
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Income vs Expense" },
    },
  };

  const categoryIncome = {};
  const categoryExpense = {};

  categories.forEach((cat) => {
    categoryIncome[cat] = 0;
    categoryExpense[cat] = 0;
  });

  transactions.forEach((t) => {
    if (t.transactionType === "income")
      categoryIncome[t.category] += Number(t.amount);
    else categoryExpense[t.category] += Number(t.amount);
  });

  const incomeCategories = Object.keys(categoryIncome).filter((cat) => categoryIncome[cat] > 0);
  const incomeValues = incomeCategories.map((cat) => categoryIncome[cat]);

  const expenseCategories = Object.keys(categoryExpense).filter((cat) => categoryExpense[cat] > 0);
  const expenseValues = expenseCategories.map((cat) => categoryExpense[cat]);

  const incomeChartData = {
    labels: incomeCategories,
    datasets: [
      {
        data: incomeValues,
        backgroundColor: incomeCategories.map((_, idx) => FIXED_COLORS[idx % FIXED_COLORS.length]),
      },
    ],
  };

  const expenseChartData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: expenseCategories.map((_, idx) => FIXED_COLORS[(idx + 5) % FIXED_COLORS.length]),
      },
    ],
  };

  // Doughnut Options ---------------------------------------------------
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1400,
      easing: "easeOutBounce",
    },
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Category-wise Distribution" },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const value = ctx.raw;
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${ctx.label}: $${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (value, ctx) => {
          if (!showPercent) return value;
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          return ((value / total) * 100).toFixed(1) + "%";
        },
      },
    },
  };

  // UI Rendering ----------------------------------------------------------
  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center border-b p-3 mb-4 mt-2">
        <h2 className="text-xl font-semibold">Transaction Dashboard</h2>

        <div className="flex gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-1 rounded bg-gray-800 text-white">{darkMode ? "Light Mode" : "Dark Mode"}</button>
          <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-1 rounded"> Add Transaction</button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className={`max-w-6xl mx-auto p-4 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}>
        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded text-center">
            <p>Total Income</p>
            <p className="text-green-600 font-bold text-xl">${totalIncome}</p>
          </div>
          <div className="bg-red-100 p-4 rounded text-center">
            <p>Total Expense</p>
            <p className="text-red-600 font-bold text-xl">${totalExpense}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded text-center">
            <p>Balance</p>
            <p className="text-blue-600 font-bold text-xl">${balance}</p>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="mb-6" style={{ height: "280px" }}>
          <Bar data={monthlyChartData} options={monthlyChartOptions} />
        </div>

        {/* DOUGHNUT CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {incomeValues.length > 0 && (
            <div className="bg-white p-4 rounded shadow" style={{ height: "260px" }}>
              <h3 className="text-lg font-bold text-green-600 text-center mb-2">
                Income by Category
              </h3>
              <div style={{ height: "200px" }}>
                <Doughnut data={incomeChartData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {expenseValues.length > 0 && (
            <div className="bg-white p-4 rounded shadow" style={{ height: "260px" }}>
              <h3 className="text-lg font-bold text-red-600 text-center mb-2">
                Expense by Category
              </h3>
              <div style={{ height: "200px" }}>
                <Doughnut data={expenseChartData} options={doughnutOptions} />
              </div>
            </div>
          )}
        </div>

        {/* FILTERS & ADD BTN */}
        <div className="flex justify-between items-center mb-4">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Transaction
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className={`min-w-full border ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
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
              {filteredTransactions.map((txn, index) => (
                <tr key={index} className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className="py-2 px-4 border-b">{txn.title}</td>

                  <td className={`py-2 px-4 border-b ${txn.transactionType === "income" ? "text-green-600" : "text-red-600"}`}>
                    ${txn.amount}
                  </td>

                  <td className="py-2 px-4 border-b">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>

                  <td className="py-2 px-4 border-b">{txn.category}</td>
                  <td className="py-2 px-4 border-b">{txn.transactionType}</td>

                  <td className="py-2 px-4 border-b space-x-2">
                    <button onClick={() => openModal(index)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(txn)} className="bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 italic">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD/EDIT Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className={`w-full max-w-lg p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
              <h2 className="text-xl font-bold mb-4">
                {editingIndex !== null ? "Edit Transaction" : "Add Transaction"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Transaction Type</label>
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label>Notes</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    rows="3"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingIndex !== null ? "Update" : "Add"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div
              className={`w-full max-w-sm p-6 rounded-lg shadow-lg text-center ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
            >
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Confirm Delete
              </h2>

              <p>Are you sure you want to delete this transaction?</p>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
