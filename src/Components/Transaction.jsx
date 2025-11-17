import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Transaction = () => {

    const categories = [
        "Groceries",
        "Salary / Wages",
        "Rent / Mortgage",
        "Shopping / Clothing",
        "Utilities",
        "Internet / Phone",
        "Transportation",
        "Maintenance / Repairs",
        "Medical / Health",
        "Education / Childcare",
        "Entertainment / Subscriptions",
        "Hobbies / Leisure",
        "Travel / Vacations",
        "Gifts / Donations",
        "Office Supplies",
        "Training / Courses",
        "Emergency Fund",
        "Investments",
        "Retirement Contributions"
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
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [filterType, setFilterType] = useState("all"); // all, income, expense
    const [viewType, setViewType] = useState("monthly"); // monthly or category

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedTransactions = [...transactions];
            updatedTransactions[editingIndex] = formData;
            setTransactions(updatedTransactions);
            setEditingIndex(null);
        } else {
            setTransactions([...transactions, formData]);
        }
        setIsModalOpen(false);
    };

    const openDeleteModal = (index) => {
        setDeleteIndex(index);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteIndex(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        const updatedTransactions = transactions.filter((_, i) => i !== deleteIndex);
        setTransactions(updatedTransactions);
        closeDeleteModal();
    };

    // Filters
    const filteredTransactions = filterType === "all" ? transactions : transactions.filter((t) => t.transactionType === filterType);

    // Totals
    const totalIncome = transactions.filter((t) => t.transactionType === "income").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions.filter((t) => t.transactionType === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    // Monthly Chart Data
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
            {
                label: "Income",
                data: monthlyIncome,
                backgroundColor: "rgba(34,197,94,0.7)",
            },
            {
                label: "Expense",
                data: monthlyExpense,
                backgroundColor: "rgba(239,68,68,0.7)",
            },
        ],
    };

    const monthlyChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Monthly Income vs Expense" },
        },
    };

    // Category Chart Data
    const categoryIncome = {};
    const categoryExpense = {};
    categories.forEach(cat => {
        categoryIncome[cat] = 0;
        categoryExpense[cat] = 0;
    });

    transactions.forEach((t) => {
        if (t.transactionType === "income") categoryIncome[t.category] += Number(t.amount);
        else categoryExpense[t.category] += Number(t.amount);
    });

    const incomeCategories = Object.keys(categoryIncome).filter(cat => categoryIncome[cat] > 0);
    const incomeValues = incomeCategories.map(cat => categoryIncome[cat]);

    const expenseCategories = Object.keys(categoryExpense).filter(cat => categoryExpense[cat] > 0);
    const expenseValues = expenseCategories.map(cat => categoryExpense[cat]);

    const incomeChartData = {
        labels: incomeCategories,
        datasets: [
            {
                data: incomeValues,
                backgroundColor: incomeCategories.map(() => `hsl(${Math.random() * 360},70%,60%)`),
            },
        ],
    };

    const expenseChartData = {
        labels: expenseCategories,
        datasets: [
            {
                data: expenseValues,
                backgroundColor: expenseCategories.map(() => `hsl(${Math.random() * 360},70%,60%)`),
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: "right" },
            title: { display: true, text: "Category-wise Distribution" },
        },
    };

    return (
        <div className="container mx-auto mt-4 px-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">User</h2>
                <div className="flex gap-2">
                    <div>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" >
                            <option value="all">All Transactions</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Title</th>
                            <th className="py-2 px-4 border-b text-left">Amount</th>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">Category</th>
                            <th className="py-2 px-4 border-b text-left">Type</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{txn.title}</td>
                                <td className={`py-2 px-4 border-b ${txn.transactionType === "income" ? "text-green-600" : "text-red-600"}`}> ${txn.amount}</td>
                                <td className="py-2 px-4 border-b">{new Date(txn.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{txn.category}</td>
                                <td className="py-2 px-4 border-b">{txn.transactionType}</td>
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button onClick={() => openModal(transactions.indexOf(txn))} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded transition duration-300">Edit</button>
                                    <button onClick={() => openDeleteModal(transactions.indexOf(txn))} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition duration-300">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                                    No transactions.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-in">
                        <h2 className="text-xl font-bold mb-4">
                            {editingIndex !== null ? "Edit Transaction" : "Add Transaction"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Transaction Type</label>
                                <select
                                    name="transactionType"
                                    value={formData.transactionType}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {editingIndex !== null ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modal-in">
                        <h2 className="text-xl font-bold mb-4 text-center text-red-600">Confirm Delete</h2>
                        <p className="mb-6 text-center">Are you sure you want to delete this transaction?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transaction;
