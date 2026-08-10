import React, { useContext, useEffect, useState } from "react";
import { FaTrash, FaUsers } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import Loader from "../../common/Loader";

export default function UserManagement() {
  const { users, loading, getUsers, deleteUser } = useContext(UserContext);

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
      user.phone.includes(search),
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Manage all users and their system access.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-2.5 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
            <FaUsers size={13} />
          </div>

          <div>
            <p className="text-xs text-stone-400">Total Users</p>
            <p className="text-sm font-semibold text-stone-900">
              {users.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf9f6] shadow-sm">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-base font-semibold text-stone-900">
            System Users
          </h2>

          <p className="mt-1 text-xs text-stone-400">
            View and manage registered users.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-stone-200 bg-stone-50/70">
              <tr>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Role
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-stone-50/80"
                  >
                    <td className="px-5 py-4 text-center text-sm text-stone-400">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-stone-900">
                        {user.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-600">
                      {user.phone || "-"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.role === "Admin"
                            ? "bg-stone-900 text-white"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 hover:text-red-600"
                        title="Delete User"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-14 text-center">
                    <p className="text-sm font-medium text-stone-700">
                      No Users Found
                    </p>

                    <p className="mt-1 text-xs text-stone-400">
                      No users match your current search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
