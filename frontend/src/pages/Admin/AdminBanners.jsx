import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/getImageUrl";

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannertitle, setBannertitle] = useState("");
  const [bannerdescription, setBannerdescription] = useState("");
  const [image, setImage] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/banners");
      setBanners(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch promotional banners.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setBannertitle("");
    setBannerdescription("");
    setImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setBannertitle(banner.title || "");
    setBannerdescription(banner.description || "");
    setImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!bannertitle || !bannerdescription) {
      setFormError("Title and description are required.");
      return;
    }

    if (!editingBanner && !image) {
      setFormError("Banner image is required for creation.");
      return;
    }

    try {
      setFormSubmitting(true);
      const data = new FormData();
      data.append("bannertitle", bannertitle);
      data.append("bannerdescription", bannerdescription);
      if (image) {
        data.append("image", image);
      }

      if (editingBanner) {
        await api.patch(`/admin/banners/update/${editingBanner._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/banners/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      closeModal();
      fetchBanners();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to save banner.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/admin/banners/del/${id}`);
      fetchBanners();
    } catch (err) {
      alert("Failed to delete banner.");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🖼️ Promotional Banners ({banners.length})</h3>
          <button className="btn-primary" onClick={openCreateModal}>
            ➕ Create New Banner
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading banners...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                      No promotional banners found.
                    </td>
                  </tr>
                ) : (
                  banners.map((b) => (
                    <tr key={b._id}>
                      <td>
                        {b.imageurl ? (
                          <img
                            src={getImageUrl(b.imageurl)}
                            alt={b.title}
                            style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : (
                          "No Preview"
                        )}
                      </td>
                      <td>
                        <strong>{b.title}</strong>
                      </td>
                      <td>{b.description}</td>
                      <td>
                        <button className="btn-action-edit" onClick={() => openEditModal(b)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDelete(b._id)}>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingBanner ? "✏️ Edit Banner" : "➕ Add Promotional Banner"}</h3>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
                    {formError}
                  </div>
                )}
                <div className="form-group">
                  <label>Banner Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Summer Sale 50% Off"
                    value={bannertitle}
                    onChange={(e) => setBannertitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Banner Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Short marketing catchphrase"
                    value={bannerdescription}
                    onChange={(e) => setBannerdescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Banner Image {editingBanner && "(Leave empty to keep existing image)"}</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBanners;
