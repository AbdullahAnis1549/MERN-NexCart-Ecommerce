import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../features/productSlice";
import { fetchCategories, selectAllCategories } from "../../features/categorySlice";
import { getImageUrl } from "../../utils/getImageUrl";

function AdminProducts() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    pname: "",
    pprice: "",
    catid: "",
    pdescription: "",
    mainStock: 10,
    isBestSeller: false,
    isFeatured: false,
    image: null,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      pname: "",
      pprice: "",
      catid: categories[0]?._id || "",
      pdescription: "",
      mainStock: 10,
      isBestSeller: false,
      isFeatured: false,
      image: null,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      pname: product.name || "",
      pprice: product.price || "",
      catid: product.catid?._id || product.catid || "",
      pdescription: product.pdescription || "",
      mainStock: product.mainStock ?? 0,
      isBestSeller: Boolean(product.isBestSeller),
      isFeatured: Boolean(product.isFeatured),
      image: null,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.pname || !formData.pprice || !formData.catid) {
      setFormError("Product name, price, and category are required.");
      return;
    }

    if (!editingProduct && !formData.image) {
      setFormError("Product image is required for new products.");
      return;
    }

    try {
      setFormSubmitting(true);
      const data = new FormData();
      data.append("pname", formData.pname);
      data.append("pprice", formData.pprice);
      data.append("catid", formData.catid);
      data.append("pdescription", formData.pdescription);
      data.append("productdescription", formData.pdescription);
      data.append("mainStock", formData.mainStock);
      data.append("isBestSeller", formData.isBestSeller);
      data.append("isFeatured", formData.isFeatured);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingProduct) {
        await dispatch(updateProductThunk({ id: editingProduct._id, formData: data })).unwrap();
      } else {
        await dispatch(createProductThunk(data)).unwrap();
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setFormError(err || "Failed to save product.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleFlag = async (product, flagName) => {
    try {
      const data = new FormData();
      data.append(flagName, !product[flagName]);
      await dispatch(updateProductThunk({ id: product._id, formData: data })).unwrap();
    } catch (err) {
      alert(`Failed to update ${flagName}`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await dispatch(deleteProductThunk(id)).unwrap();
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>📦 Product Management ({products.length})</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary" onClick={openCreateModal}>
              ➕ Add New Product
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading products...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Home Collections</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.productimage ? (
                          <img
                            src={getImageUrl(product.productimage)}
                            alt={product.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.catid?.categoryName || product.catid?.name || "General"}</td>
                      <td>Rs. {product.price?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${product.mainStock < 5 ? "badge-cancelled" : "badge-delivered"}`}>
                          {product.mainStock} in stock
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleFlag(product, "isBestSeller")}
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: product.isBestSeller ? "#f59e0b" : "#334155",
                              color: product.isBestSeller ? "#000" : "#94a3b8",
                              textAlign: "center",
                              transition: "all 0.2s"
                            }}
                            title="Click to toggle Best Seller section on Home Page"
                          >
                            {product.isBestSeller ? "🔥 Best Seller (Active)" : "+ Add Best Seller"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFlag(product, "isFeatured")}
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: product.isFeatured ? "#febd69" : "#334155",
                              color: product.isFeatured ? "#131921" : "#94a3b8",
                              textAlign: "center",
                              transition: "all 0.2s"
                            }}
                            title="Click to toggle Featured Collection section on Home Page"
                          >
                            {product.isFeatured ? "⭐ Featured (Active)" : "+ Add Featured"}
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className="btn-action-edit" onClick={() => openEditModal(product)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDelete(product._id)}>
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
              <h3>{editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
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
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="pname"
                    className="form-control"
                    placeholder="Enter product title"
                    value={formData.pname}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input
                    type="number"
                    name="pprice"
                    className="form-control"
                    placeholder="Enter price"
                    value={formData.pprice}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="catid"
                    className="form-control"
                    value={formData.catid}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName || cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock Count</label>
                  <input
                    type="number"
                    name="mainStock"
                    className="form-control"
                    value={formData.mainStock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="pdescription"
                    className="form-control"
                    rows="3"
                    placeholder="Enter product details"
                    value={formData.pdescription}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Home Page Display Flags */}
                <div className="form-group" style={{ backgroundColor: "#1e293b", padding: "0.85rem", borderRadius: "8px", border: "1px solid #334155" }}>
                  <label style={{ fontWeight: "700", color: "#febd69", marginBottom: "0.5rem", display: "block" }}>
                    🏠 Home Page Sections Management
                  </label>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#f8fafc", fontSize: "0.9rem" }}>
                      <input
                        type="checkbox"
                        name="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={handleInputChange}
                      />
                      🔥 Best Selling Section
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#f8fafc", fontSize: "0.9rem" }}>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      ⭐ Featured Collection Section
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Image {editingProduct && "(Leave empty to keep current image)"}</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
