import Product from "@/types/custom";
import path from "path";
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

    // Check file size
    if (product.foto.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2 MB.");
      return;
    }

    // Check file extension
    const allowedExtensions = ["png", "jpg", "jpeg"];
    const fileExtension = product.foto.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Allowed file extensions: .png, .jpg, .jpeg");
      return;
    }

    const formData = new FormData();
    formData.append("nama", product.nama);
    formData.append("deskripsi", product.deskripsi);
    formData.append("harga", product.harga.toString());
    formData.append("stok", product.stok.toString());
    formData.append("foto", product.foto);
    formData.append("suplier_id", product.suplier_id.toString());

    fetch(`${API_URL}/api/products/create`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        // Refresh the product list after creating a new product
        fetchProductList();
      })
      .catch((error) => {
        console.error("Error creating product:", error.message);
      });
  };

  const fetchProductList = () => {
    setLoading(true);
    fetch(`${API_URL}/api/products/read`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product list:", error.message);
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
        })
        .catch((error) => {
          console.error("Error updating product:", error.message);
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
      })
      .catch((error) => {
        console.error("Error deleting product:", error.message);
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProduct((prevProduct) => ({ ...prevProduct, foto: file }));
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
          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              name="foto"
              onChange={handleFileChange}
            />
          </label>
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
            onClick={handleUpdate}
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
            {products.length !== 0 &&
              products.map((p: Product) => (
                <li key={p.id} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      columnGap: "5px",
                    }}
                  >
                    <strong>Image:</strong> <p>{p.foto}</p>
                    <img
                      src={`http://localhost:3000/${p.foto}`}
                      alt={p.nama}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                    <strong>Nama:</strong> {p.nama}
                    <strong>Harga:</strong> {p.harga}
                    <strong>Stok:</strong> {p.stok}
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
                  </div>
                </li>
              ))}
            {products.length === 0 && <p>Add data, please!</p>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
