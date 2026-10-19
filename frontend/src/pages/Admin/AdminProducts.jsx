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
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    colors: [],
    sizes: [],
    variants: [],
    image: null,
  });
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#111827");
  const [newSizeName, setNewSizeName] = useState("");
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
      salePrice: "",
      saleStartDate: "",
      saleEndDate: "",
      colors: [],
      sizes: [],
      variants: [],
      image: null,
    });
    setNewColorName("");
    setNewColorHex("#111827");
    setNewSizeName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const existingColors = Array.isArray(product.colors)
      ? product.colors.map((c) => ({ name: c.name || "", hex: c.hex || "#000000" }))
      : [];
    const existingSizes = Array.isArray(product.sizes) ? [...product.sizes] : [];
    const existingVariants = Array.isArray(product.variants)
      ? product.variants.map((v) => ({
          color: v.color || "",
          size: v.size || "",
          stock: v.stock ?? 0,
        }))
      : [];

    setFormData({
      pname: product.name || "",
      pprice: product.price || "",
      catid: product.catid?._id || product.catid || "",
      pdescription: product.pdescription || "",
      mainStock: product.mainStock ?? 0,
      isBestSeller: Boolean(product.isBestSeller),
      isFeatured: Boolean(product.isFeatured),
      salePrice: product.salePrice != null ? product.salePrice : "",
      saleStartDate: product.saleStartDate
        ? new Date(product.saleStartDate).toISOString().slice(0, 16)
        : "",
      saleEndDate: product.saleEndDate
        ? new Date(product.saleEndDate).toISOString().slice(0, 16)
        : "",
      colors: existingColors,
      sizes: existingSizes,
      variants: existingVariants,
      image: null,
    });
    setNewColorName("");
    setNewColorHex("#111827");
    setNewSizeName("");
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

  // Add Color Handler
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const exists = formData.colors.some(
      (c) => c.name.toLowerCase() === newColorName.trim().toLowerCase()
    );
    if (exists) return;

    const updatedColors = [
      ...formData.colors,
      { name: newColorName.trim(), hex: newColorHex },
    ];
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
    setNewColorName("");
    setNewColorHex("#111827");
  };

  const handleRemoveColor = (indexToRemove) => {
    const updatedColors = formData.colors.filter((_, idx) => idx !== indexToRemove);
    // Also remove variants with this color
    const removedColorName = formData.colors[indexToRemove]?.name;
    const updatedVariants = formData.variants.filter(
      (v) => v.color.toLowerCase() !== removedColorName?.toLowerCase()
    );
    const updatedStock = updatedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);

    setFormData((prev) => ({
      ...prev,
      colors: updatedColors,
      variants: updatedVariants,
      mainStock: updatedVariants.length > 0 ? updatedStock : prev.mainStock,
    }));
  };

  // Add Size Handler
  const handleAddSize = (sizeToAdd) => {
    const cleanSize = (sizeToAdd || newSizeName).trim().toUpperCase();
    if (!cleanSize) return;
    if (formData.sizes.includes(cleanSize)) return;

    const updatedSizes = [...formData.sizes, cleanSize];
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
    setNewSizeName("");
  };

  const handleRemoveSize = (sizeToRemove) => {
    const updatedSizes = formData.sizes.filter((s) => s !== sizeToRemove);
    const updatedVariants = formData.variants.filter(
      (v) => v.size.toUpperCase() !== sizeToRemove.toUpperCase()
    );
    const updatedStock = updatedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);

    setFormData((prev) => ({
      ...prev,
      sizes: updatedSizes,
      variants: updatedVariants,
      mainStock: updatedVariants.length > 0 ? updatedStock : prev.mainStock,
    }));
  };

  // Generate / Sync Variants Matrix from selected colors and sizes
  const handleGenerateVariants = () => {
    if (formData.colors.length === 0 && formData.sizes.length === 0) return;

    const newVariants = [];
    const colorsList = formData.colors.length > 0 ? formData.colors : [{ name: "" }];
    const sizesList = formData.sizes.length > 0 ? formData.sizes : [""];

    colorsList.forEach((c) => {
      sizesList.forEach((s) => {
        // Look up existing stock if previously set
        const existing = formData.variants.find(
          (v) =>
            v.color.toLowerCase() === (c.name || "").toLowerCase() &&
            v.size.toUpperCase() === (s || "").toUpperCase()
        );
        newVariants.push({
          color: c.name || "",
          size: s || "",
          stock: existing ? existing.stock : 5,
        });
      });
    });

    const totalStock = newVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
      mainStock: totalStock,
    }));
  };

  const handleVariantStockChange = (index, newStock) => {
    const qty = Math.max(0, Number(newStock) || 0);
    const updatedVariants = formData.variants.map((v, idx) =>
      idx === index ? { ...v, stock: qty } : v
    );
    const totalStock = updatedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
      mainStock: totalStock,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.pname || !formData.pprice || !formData.catid) {
      setFormError("Product name, price, and category are required.");
      return;
    }

    if (formData.salePrice && Number(formData.salePrice) >= Number(formData.pprice)) {
      setFormError("Sale price must be strictly less than standard price.");
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

      // Sale fields
      if (formData.salePrice) data.append("salePrice", formData.salePrice);
      if (formData.saleStartDate) data.append("saleStartDate", formData.saleStartDate);
      if (formData.saleEndDate) data.append("saleEndDate", formData.saleEndDate);

      // Attributes
      data.append("colors", JSON.stringify(formData.colors));
      data.append("sizes", JSON.stringify(formData.sizes));
      data.append("variants", JSON.stringify(formData.variants));

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
                  <th>Price & Sale</th>
                  <th>Rating</th>
                  <th>Colors / Sizes</th>
                  <th>Stock</th>
                  <th>Home Collections</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", color: "#64748b" }}>
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
                      <td>
                        {product.isOnSale ? (
                          <div>
                            <div style={{ color: "#febd69", fontWeight: "800", fontSize: "0.95rem" }}>
                              Rs. {product.activePrice?.toLocaleString()}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", textDecoration: "line-through" }}>
                              Rs. {product.price?.toLocaleString()}
                            </div>
                            <span style={{ fontSize: "0.7rem", backgroundColor: "#dc2626", color: "#ffffff", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: "700" }}>
                              {product.discountPercent}% OFF
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: "700", color: "#ffffff" }}>
                            Rs. {product.price?.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ color: "#f59e0b", fontSize: "1rem" }}>★</span>
                          <span style={{ fontWeight: "700", color: "#f8fafc", fontSize: "0.85rem" }}>
                            {product.averageRating || 0}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                            ({product.numReviews || 0})
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {product.colors && product.colors.length > 0 && (
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
                              {product.colors.map((c, i) => (
                                <span
                                  key={i}
                                  title={c.name}
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    backgroundColor: c.hex || "#333",
                                    border: "1px solid #cbd5e1",
                                    display: "inline-block",
                                  }}
                                />
                              ))}
                              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>({product.colors.length})</span>
                            </div>
                          )}
                          {product.sizes && product.sizes.length > 0 && (
                            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                              {product.sizes.map((s, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: "0.65rem",
                                    padding: "0.1rem 0.35rem",
                                    borderRadius: "3px",
                                    backgroundColor: "#131921",
                                    border: "1px solid #2e3a52",
                                    color: "#cbd5e1",
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {(!product.colors || product.colors.length === 0) && (!product.sizes || product.sizes.length === 0) && (
                            <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Standard</span>
                          )}
                        </div>
                      </td>
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
          <div className="modal-container" style={{ maxWidth: "680px" }}>
            <div className="modal-header">
              <h3>{editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                    {formError}
                  </div>
                )}

                {/* Product Name */}
                <div className="form-group">
                  <label>Product Name *</label>
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

                {/* Category */}
                <div className="form-group">
                  <label>Category *</label>
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

                {/* Pricing & Sale Section */}
                <div style={{ backgroundColor: "#182030", padding: "1rem", borderRadius: "10px", border: "1px solid #2e3a52", marginBottom: "1.4rem" }}>
                  <label style={{ fontWeight: "700", color: "#febd69", marginBottom: "0.75rem", display: "block", fontSize: "0.9rem" }}>
                    💰 Pricing & Sale Details
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.85rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Standard Price (Rs.) *</label>
                      <input
                        type="number"
                        name="pprice"
                        className="form-control"
                        placeholder="e.g. 2999"
                        value={formData.pprice}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Sale / Discounted Price (Rs.)</label>
                      <input
                        type="number"
                        name="salePrice"
                        className="form-control"
                        placeholder="Leave blank if not on sale"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Sale Start Date (Optional)</label>
                      <input
                        type="datetime-local"
                        name="saleStartDate"
                        className="form-control"
                        value={formData.saleStartDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Sale End Date (Optional)</label>
                      <input
                        type="datetime-local"
                        name="saleEndDate"
                        className="form-control"
                        value={formData.saleEndDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Colors Section */}
                <div style={{ backgroundColor: "#182030", padding: "1rem", borderRadius: "10px", border: "1px solid #2e3a52", marginBottom: "1.4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <label style={{ fontWeight: "700", color: "#febd69", fontSize: "0.9rem", margin: 0 }}>
                      🎨 Available Colors ({formData.colors.length})
                    </label>
                  </div>

                  {/* Active Colors list */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem", minHeight: "32px" }}>
                    {formData.colors.length === 0 ? (
                      <span style={{ color: "#64748b", fontSize: "0.8rem" }}>No colors added yet.</span>
                    ) : (
                      formData.colors.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            backgroundColor: "#131921",
                            border: "1px solid #2e3a52",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            color: "#f8fafc",
                          }}
                        >
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: c.hex,
                              border: "1px solid #94a3b8",
                            }}
                          />
                          {c.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(i)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "0 0.2rem",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add Color inputs */}
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ flex: 1 }}
                      placeholder="Color name (e.g. Midnight Navy)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      title="Choose hex color"
                      style={{
                        width: "44px",
                        height: "38px",
                        padding: "2px",
                        backgroundColor: "#131921",
                        border: "1px solid #2e3a52",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleAddColor}
                      style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                {/* Sizes Section */}
                <div style={{ backgroundColor: "#182030", padding: "1rem", borderRadius: "10px", border: "1px solid #2e3a52", marginBottom: "1.4rem" }}>
                  <label style={{ fontWeight: "700", color: "#febd69", fontSize: "0.9rem", marginBottom: "0.6rem", display: "block" }}>
                    📏 Available Sizes ({formData.sizes.length})
                  </label>

                  {/* Quick Add Presets */}
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Quick add:</span>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddSize(preset)}
                        disabled={formData.sizes.includes(preset)}
                        style={{
                          backgroundColor: formData.sizes.includes(preset) ? "#334155" : "#131921",
                          color: formData.sizes.includes(preset) ? "#64748b" : "#cbd5e1",
                          border: "1px solid #2e3a52",
                          borderRadius: "4px",
                          padding: "0.2rem 0.5rem",
                          fontSize: "0.75rem",
                          cursor: formData.sizes.includes(preset) ? "not-allowed" : "pointer",
                        }}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>

                  {/* Active sizes chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.85rem", minHeight: "28px" }}>
                    {formData.sizes.length === 0 ? (
                      <span style={{ color: "#64748b", fontSize: "0.8rem" }}>No sizes added yet.</span>
                    ) : (
                      formData.sizes.map((s) => (
                        <span
                          key={s}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            backgroundColor: "#131921",
                            border: "1px solid #febd69",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            color: "#febd69",
                            fontWeight: "700",
                          }}
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(s)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "0 0.2rem",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Custom Size input */}
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ flex: 1 }}
                      placeholder="Custom size (e.g. 42, 10, Free Size)"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleAddSize(newSizeName)}
                      style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
                    >
                      + Add Size
                    </button>
                  </div>
                </div>

                {/* Optional Variant Stock Grid */}
                {(formData.colors.length > 0 || formData.sizes.length > 0) && (
                  <div style={{ backgroundColor: "#182030", padding: "1rem", borderRadius: "10px", border: "1px solid #2e3a52", marginBottom: "1.4rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                      <div>
                        <label style={{ fontWeight: "700", color: "#febd69", fontSize: "0.9rem", margin: 0 }}>
                          ⚙️ Variant Stock Breakdown (Optional)
                        </label>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                          Set individual stock per color/size combo. Total main stock updates automatically.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateVariants}
                        style={{
                          backgroundColor: "#131921",
                          color: "#febd69",
                          border: "1px solid #febd69",
                          borderRadius: "6px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        ⚡ Sync Matrix
                      </button>
                    </div>

                    {formData.variants.length > 0 ? (
                      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #2e3a52", borderRadius: "8px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#131921", color: "#94a3b8" }}>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Color</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Size</th>
                              <th style={{ padding: "0.5rem 0.75rem", width: "110px" }}>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.variants.map((v, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid #242f44" }}>
                                <td style={{ padding: "0.4rem 0.75rem", color: "#f8fafc" }}>
                                  {v.color || "Default"}
                                </td>
                                <td style={{ padding: "0.4rem 0.75rem", color: "#f8fafc" }}>
                                  {v.size || "Default"}
                                </td>
                                <td style={{ padding: "0.4rem 0.75rem" }}>
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={(e) => handleVariantStockChange(idx, e.target.value)}
                                    style={{
                                      width: "80px",
                                      padding: "0.3rem 0.5rem",
                                      backgroundColor: "#131921",
                                      border: "1px solid #2e3a52",
                                      borderRadius: "4px",
                                      color: "#f8fafc",
                                      fontSize: "0.85rem",
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
                        Click "Sync Matrix" to configure stock per combination, or simply use the Overall Stock below.
                      </p>
                    )}
                  </div>
                )}

                {/* Overall Stock */}
                <div className="form-group">
                  <label>
                    Total Stock Count * {formData.variants.length > 0 && "(Auto-synced from variants)"}
                  </label>
                  <input
                    type="number"
                    name="mainStock"
                    className="form-control"
                    value={formData.mainStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    disabled={formData.variants.length > 0}
                  />
                </div>

                {/* Description */}
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
