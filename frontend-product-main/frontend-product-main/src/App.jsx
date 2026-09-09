import "./App.css";
import { useState } from "react";
import { Package, Pencil, Trash2, PlusCircle, X } from "lucide-react";

const DEMO_PRODUCTS = [
  { id: 1, name: "Keyboard Gaming", price: 1290 },
  { id: 2, name: "เมาส์ Bluetooth", price: 890 },
  { id: 3, name: "หูฟัง Wireless", price: 1590 },
];

function App() {
  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const PRODUCTS_ENDPOINT = API_URL ? `${API_URL}/products` : null;
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshProducts = async () => {
    if (!PRODUCTS_ENDPOINT) {
      setProducts(DEMO_PRODUCTS);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(PRODUCTS_ENDPOINT);
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : DEMO_PRODUCTS);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "ไม่สามารถโหลดข้อมูลได้";
      setError(message);
      setProducts((currentProducts) =>
        currentProducts.length > 0 ? currentProducts : DEMO_PRODUCTS,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!PRODUCTS_ENDPOINT) {
        const newProduct = {
          id: Date.now(),
          name: name.trim(),
          price: Number(price),
        };

        setProducts((currentProducts) => [newProduct, ...currentProducts]);
        setName("");
        setPrice("");
        return;
      }

      const response = await fetch(PRODUCTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), price: Number(price) }),
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");

      setName("");
      setPrice("");
      await refreshProducts();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!PRODUCTS_ENDPOINT) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingId
              ? { ...product, name: name.trim(), price: Number(price) }
              : product,
          ),
        );
        cancelEditing();
        return;
      }

      const response = await fetch(`${PRODUCTS_ENDPOINT}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), price: Number(price) }),
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingId
            ? { ...product, name: name.trim(), price: Number(price) }
            : product,
        ),
      );
      cancelEditing();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) return;

    try {
      if (!PRODUCTS_ENDPOINT) {
        setProducts((current) => current.filter((item) => item.id !== id));
        if (editingId === id) cancelEditing();
        return;
      }

      const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการลบข้อมูล");

      setProducts((current) => current.filter((item) => item.id !== id));
      if (editingId === id) cancelEditing();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "เกิดข้อผิดพลาดในการลบข้อมูล";
      alert(message);
    }
  };

  const startEditingProduct = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
  };

  const cancelEditing = () => {
    setName("");
    setPrice("");
    setEditingId(null);
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="hero-panel rounded-box px-5 py-7 text-primary-content shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/15">
                  <Package className="size-7" />
                </div>
                <span className="badge badge-outline border-white/40 text-white">
                  Product
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Product Management System
              </h1>
              <p className="mt-2 max-w-xl text-sm text-primary-content/75 sm:text-base">
                จัดการสินค้าและราคาได้อย่างรวดเร็วในที่เดียว
              </p>
            </div>
          </div>
        </header>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <PlusCircle className="size-5" />
              </div>
              <div>
                <h2 className="card-title text-xl">
                  {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                </h2>
                <p className="text-sm text-base-content/60">
                  {editingId
                    ? "แก้ไขรายละเอียดสินค้าแล้วกดบันทึก"
                    : "กรอกข้อมูลเพื่อเพิ่มรายการเข้าสู่ระบบ"}
                </p>
              </div>
            </div>

            <form
              className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.65fr_auto] md:items-end"
              onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
            >
              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium">ชื่อสินค้า</span>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Gaming keyboard"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-2 font-medium">ราคา (บาท)</span>
                <input
                  className="input input-bordered w-full"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="เช่น 1500"
                />
              </label>

              <div className="flex gap-2">
                <button
                  className="btn btn-primary flex-1 md:w-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Pencil className="size-4" />
                  {isSubmitting
                    ? "กำลังบันทึก..."
                    : editingId
                      ? "บันทึกการแก้ไข"
                      : "บันทึกข้อมูล"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="btn btn-ghost"
                  >
                    <X className="size-4" />
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {error && (
          <div className="alert alert-error shadow-sm">
            <span>เกิดข้อผิดพลาด: {error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-box border border-base-300 bg-base-100 shadow-sm">
            <span className="loading loading-dots loading-lg text-primary" />
            <span className="sr-only">กำลังโหลดข้อมูล...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="card border border-dashed border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center py-14 text-center">
              <Package className="size-12 text-base-content/25" />
              <h2 className="card-title mt-2">ยังไม่มีข้อมูลสินค้า</h2>
              <p className="text-sm text-base-content/60">
                เริ่มต้นด้วยการเพิ่มสินค้าใหม่ด้านบน
              </p>
            </div>
          </div>
        ) : (
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-0">
              <div className="flex items-center justify-between px-5 py-5 sm:px-6">
                <div>
                  <h2 className="card-title">รายการสินค้าทั้งหมด</h2>
                  <p className="text-sm text-base-content/60">
                    มีสินค้า {products.length} รายการ
                  </p>
                </div>
                <span className="badge badge-primary badge-lg">
                  {products.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>รหัส</th>
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th className="text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id}>
                        <td className="font-mono text-xs text-base-content/50">
                          #{item.id}
                        </td>
                        <td className="font-medium">{item.name}</td>
                        <td className="font-bold text-success">
                          {Number(item.price).toLocaleString()}฿
                        </td>
                        <td className="text-right space-x-1">
                          <button
                            onClick={() => startEditingProduct(item)}
                            className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                            title="แก้ไข"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                            title="ลบ"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
