import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUsers, createUser, updateUser, deleteUser } from "../Services/userService";


const User = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const [userList, setUserList] = useState([]);
    const [updateUserData, setUpdateUserData] = useState(null);
    const [deleteUserData, setDeleteUserData] = useState(null);
    const [userError, setUserError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setUserError("");
        try {
            const data = await getUsers();
            if (data && Array.isArray(data.users)) {
                setUserList(data.users);
            } else {
                setUserList([]);
                setUserError("No users found.");
            }
        } catch (error) {
            setUserError(error.message || "Failed to fetch users. Please try again.");
        }
    };

    const refreshFn = () => fetchUsers();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUserError("");

        try {
            if (updateUserData) {
                if (formData?.password == "" || !formData?.password) delete formData.password;
                if ('email' in formData) {
                    delete formData.email;
                }
                const updatedUser = await updateUser(updateUserData._id, formData);
                loadUsers();
                toast.success("User updated successfully!");
            } else {
                const newUser = await createUser(formData);
                loadUsers();
                toast.success("User created successfully!");
            }

            closeModal();
        } catch (error) {
            setUserError(error.message || "Something went wrong. Please try again.");
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const editUserModal = (user) => {
        setUpdateUserData(user);
        setFormData({ name: user.name, email: user.email, password: "" });
        setShowAddModal(true);
    };

    const deleteUserModal = (user) => {
        setDeleteUserData(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!deleteUserData?._id) return;

        setLoading(true);
        setUserError("");
        try {
            await deleteUser(deleteUserData._id);

            toast.success("User deleted successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            setUserError(error.message || "Failed to delete user. Please try again.");
            toast.error(error.message || "Failed to delete user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowAddModal(false);
        setUpdateUserData(null);
        setFormData({ name: "", email: "", password: "" });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="container mx-auto mt-4 px-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">User</h2>
                <div className="flex gap-2">
                    <button onClick={refreshFn} className="btn border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50">Refresh</button>
                    <button onClick={() => setShowAddModal(true)} className="btn bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                        Add User
                    </button>
                </div>
            </div>

            {userError && loading ? (<h4 className="p-3 text-center text-red-600">{userError}</h4>) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-200 bg-blue-50">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Name</th>
                                <th className="border px-4 py-2 text-left">Email</th>
                                <th className="border px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-100">
                                    <td className="border px-4 py-2 capitalize">{user.name}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <button
                                            onClick={() => editUserModal(user)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mx-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUserModal(user)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mx-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {userList.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-3 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Update Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center border-b px-4 py-3">
                                <h2 className="text-lg font-semibold"> {updateUserData ? "Update User" : "Add User"} </h2>
                                <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <label className="block font-medium mb-1">Name</label>
                                    <input type="text" name="name" className="w-full border rounded px-3 py-2" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Email</label>
                                    <input type="email" name="email" className="w-full border rounded px-3 py-2" value={formData.email} onChange={handleChange} required />
                                </div>
                                {!updateUserData && (
                                    <div>
                                        <label className="block font-medium mb-1">Password</label>
                                        <input type="password" name="password" className="w-full border rounded px-3 py-2" value={formData.password} onChange={handleChange} required />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 border-t px-4 py-3">
                                <button type="button" onClick={closeModal} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">Close</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"                                >
                                    {updateUserData ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-lg font-semibold">Delete User</h2>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete{" "}
                                <span className="text-blue-600 font-medium capitalize">
                                    {deleteUserData?.name}
                                </span>
                                ?
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 border-t px-4 py-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
