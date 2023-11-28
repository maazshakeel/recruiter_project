import { Product } from "@/types/custom";
import React, { useState, useEffect, ChangeEvent } from "react";

const API_URL = "http://localhost:3000";

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product | any>({
    id: 0,
    nama: "",
    deskripsi: "",
    harga: 0,
    stok: 0,
    foto: "",
    suplier_id: 0,
    suplier: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [supliers, setSupliers] = useState([]);
  const [suplier, setSuplier] = useState<string>();
  const [nama, setNama] = useState<string>();
  const [alamat, setAlamat] = useState<string>();
  const [email, setEmail] = useState<string>();

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
      suplier <= 0
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
    formData.append("suplier_id", suplier.toString());

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

  const handleUpdate = () => {
    const productId = window.prompt("Enter the product ID for update:");
    if (productId) {
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

      fetch(`${API_URL}/api/products/update?id=${productId}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(() => {
          // Refresh the product list after updating a product
          fetchProductList();
          setProduct({
            id: 0,
            nama: "",
            deskripsi: "",
            harga: 0,
            stok: 0,
            foto: "",
            suplier_id: 0,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating product:", error.message);
        });
    } else {
      alert("Invalid!");
    }
  };

  const fetchProductList = () => {
    setLoading(true);
    fetch(`${API_URL}/api/products/read`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data[0]);
        setSupliers(data[1]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product list:", error.message);
      });
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
    setProduct((prevProduct: Product | any) => ({
      ...prevProduct,
      foto: file,
    }));
  };

  const handleSuplierCreate = () => {
    if (!nama || !email || !alamat) {
      alert("Empty");
      return;
    }
    fetch(`${API_URL}/api/products/suplier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        alamat,
        email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        fetchProductList();
        alert("Created!");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
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
          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              name="foto"
              onChange={handleFileChange}
            />
          </label>

          <br />
          <br />

          {supliers.length !== 0 && (
            <>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Supplier ID: {suplier}
              </label>
              {!loading && (
                <select
                  name="suplier_id"
                  value={product.suplier_id}
                  onChange={(e) => setSuplier(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <option value="">Select Supplier</option>
                  {supliers.map((j) => (
                    <option key={j.id_suplier} value={j.id_suplier}>
                      {j.id_suplier}
                    </option>
                  ))}
                </select>
              )}
              {/* {!loading && (
                <select
                  name="suplier_id"
                  value={product.suplier_id}
                  onChange={(e) => setSuplier(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <option value="">Select Supplier</option>
                  {supliers.map((index, ddd) => (
                    <option key={ddd.id_suplier} value={ddd.id_suplier}>
                      {ddd.id_suplier}
                    </option>
                  ))}
                </select>
              )} */}
            </>
          )}

          {supliers.length === 0 && <p>No supliers</p>}
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
        <h2>Create Suplier</h2>

        <form style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            name="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Alamat:
          </label>
          <input
            type="text"
            name="alamat"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button
            type="button"
            onClick={handleSuplierCreate}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Suplier
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
              products.map((p: Product | any) => (
                <li key={p.id} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      columnGap: "5px",
                    }}
                  >
                    <p>{p.id}</p>
                    <strong>Image:</strong>
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
