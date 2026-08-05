import React, { useContext, useEffect, useState } from "react";
import { FaTrash, FaUsers } from "react-icons/fa";
import { UserContext } from "../../context/userContext";
import Loader from "../../common/Loader";



export default function UserManagement() {
  const { users, loading, getUsers, deleteUser } =
    useContext(UserContext);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("User Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="text-gray-500">
            Manage all system users
          </p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2">
          <FaUsers />
          {users.length} Users
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-4">

        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">#</th>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Email
              </th>

              <th className="p-3 text-left">
                Phone
              </th>
              <th className="p-3 text-center">
                Role
              </th>

              <th className="p-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3">
                    {user.phone}
                  </td>

                  

                  <td className="p-3 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="p-3">

                    <div className="flex justify-center">

                      <button
                        onClick={() =>
                          handleDelete(user._id)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>
                </tr>
              ))
            ) : (
              <tr>

                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500"
                >
                  No Users Found
                </td>

              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}