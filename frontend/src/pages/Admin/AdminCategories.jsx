import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../features/categorySlice";
import { getImageUrl } from "../../utils/getImageUrl";

function AdminCategories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [cname, setCname] = useState("");
  const [image, setImage] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCname("");
    setImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setCname(cat.name || cat.categoryName || "");
    setImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!cname) {
      setFormError("Category name is required.");
      return;
    }

    if (!editingCategory && !image) {
      setFormError("Category image is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      const data = new FormData();
      data.append("cname", cname);
      if (image) {
        data.append("image", image);
      }

      if (editingCategory) {
        await dispatch(updateCategoryThunk({ id: editingCategory._id, formData: data })).unwrap();
      } else {
        await dispatch(createCategoryThunk(data)).unwrap();
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setFormError(err || "Failed to save category.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
    } catch (err) {
      alert("Failed to delete category.");
      console.error(err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || c.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>🗂️ Category Management ({categories.length})</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary" onClick={openCreateModal}>
              ➕ Add New Category
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading categories...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {cat.imageurl ? (
                          <img
                            src={getImageUrl(cat.imageurl)}
                            alt={cat.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <strong>{cat.name || cat.categoryName}</strong>
                      </td>
                      <td>
                        <code style={{ fontSize: "0.8rem", color: "#64748b" }}>{cat._id}</code>
                      </td>
                      <td>
                        <button className="btn-action-edit" onClick={() => openEditModal(cat)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDelete(cat._id)}>
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}</h3>
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
                  <label>Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter category name (e.g., Electronics)"
                    value={cname}
                    onChange={(e) => setCname(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category Image {editingCategory && "(Leave empty to keep existing image)"}</label>
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
                  {formSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
