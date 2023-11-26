import Product from "@/types/custom";
import React, { useState, useEffect, ChangeEvent } from "react";

const API_URL = "http://localhost:3000";

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: 0,
    nama: "",
    deskripsi: "",
    harga: 0,
    stok: 0,
    foto: "",
    suplier_id: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch product list when the component mounts
    setLoading(true);
    fetchProductList();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    // Basic validation
    if (
      !product.nama ||
      !product.deskripsi ||
      product.harga <= 0 ||
      product.stok <= 0 ||
      !product.foto ||
      product.suplier_id <= 0
    ) {
      alert("Please fill in all fields before creating the product.");
      return;
    }

    fetch(`${API_URL}/api/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then(() => {
        // Refresh the product list after creating a new product
        fetchProductList();
      });
  };
  const fetchProductList = () => {
    setLoading(true);
    fetch(`${API_URL}/api/products/read`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    const productId = window.prompt("Enter the product ID for update:");
    if (productId) {
      fetch(`${API_URL}/api/products/update?id=${parseInt(productId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then(() => {
          // Refresh the product list after updating a product
          fetchProductList();
        });
    }
  };

  const handleDelete = (id: number) => {
    fetch(`${API_URL}/api/products/delete?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Refresh the product list after deleting a product
        fetchProductList();
      });
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "auto",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {/* Form column */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ textAlign: "center", color: "#333" }}>
          Product Management
        </h1>

        <form style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            name="nama"
            value={product.nama}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Description:
          </label>
          <input
            type="text"
            name="deskripsi"
            value={product.deskripsi}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Price:
          </label>
          <input
            type="number"
            name="harga"
            value={product.harga}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Stock:
          </label>
          <input
            type="number"
            name="stok"
            value={product.stok}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Image URL:
          </label>
          <input
            type="text"
            name="foto"
            value={product.foto}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Supplier ID:
          </label>
          <input
            type="number"
            name="suplier_id"
            value={product.suplier_id}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button
            type="button"
            onClick={handleCreate}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Product
          </button>
          <button
            type="button"
            onClick={() => handleUpdate(product.id)}
            style={{
              backgroundColor: "#008CBA",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Update Product
          </button>
        </form>
      </div>

      {/* Product list column */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2 style={{ color: "#333" }}>Product List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {products.map((p: Product) => (
              <li key={p.id} style={{ marginBottom: "10px" }}>
                {p.nama} - {p.harga} - {p.stok}
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "5px",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
