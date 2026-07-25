import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAdminUsers,
  deleteAdminUserThunk,
  selectAdminUsersList,
  selectAdminLoading,
  selectAdminError,
} from "../../features/adminSlice";
import api from "../../api/axios";

function AdminUsers() {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsersList);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal for User Details & Order History
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const openUserModal = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      const res = await api.get(`/admin/users/${user._id}`);
      setUserDetail(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserDetail(null);
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      await dispatch(deleteAdminUserThunk(id)).unwrap();
    } catch (err) {
      alert(err || "Failed to delete user.");
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>👥 Registered Customers ({users.length})</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading users...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Verification</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.verifystatus ? "badge-delivered" : "badge-cancelled"}`}>
                          {u.verifystatus ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-action-edit" onClick={() => openUserModal(u)}>
                          👁️ View Profile
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDeleteUser(u._id, u.name)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail & History Modal */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "650px" }}>
            <div className="modal-header">
              <h3>👤 User Profile: {selectedUser.name}</h3>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {modalLoading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>Loading profile...</div>
              ) : userDetail ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Email:</strong> {userDetail.user?.email}
                      </p>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Role:</strong> {userDetail.user?.role}
                      </p>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Verified:</strong> {userDetail.user?.verifystatus ? "Yes" : "No"}
                      </p>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Total Orders:</strong> {userDetail.totalOrders}
                      </p>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>Total Spent:</strong> Rs. {userDetail.totalSpent?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: "0.75rem" }}>Order History</h4>
                  {userDetail.orders?.length === 0 ? (
                    <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No orders placed yet.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userDetail.orders?.map((ord) => (
                          <tr key={ord._id}>
                            <td>#{ord._id.substring(ord._id.length - 6).toUpperCase()}</td>
                            <td>Rs. {(ord.grandTotal || ord.totalAmount)?.toLocaleString()}</td>
                            <td>
                              <span className={`badge badge-${ord.status?.toLowerCase()}`}>{ord.status}</span>
                            </td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <p style={{ color: "red" }}>Failed to load user details.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
