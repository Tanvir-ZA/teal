import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [sizesStock, setSizesStock] = useState<Record<string, number>>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSizeStockChange = (size: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setSizesStock((prev) => ({
      ...prev,
      [size]: numValue,
    }));
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setCategory("T-Shirts");
    setPrice("");
    setDescription("");
    setImages([]);
    setImageUrlInput("");
    setSizesStock({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  };

  const handleEditClick = (product: IProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setImages(product.images || []);

    if (product.sizes_stock) {
      setSizesStock({
        S: product.sizes_stock.S || 0,
        M: product.sizes_stock.M || 0,
        L: product.sizes_stock.L || 0,
        XL: product.sizes_stock.XL || 0,
        XXL: product.sizes_stock.XXL || 0,
      });
    } else {
      setSizesStock({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
    }
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || images.length === 0) {
      alert("Please fill in all required fields and add at least one image.");
      return;
    }

    setIsSubmitting(true);

    const totalStock = Object.values(sizesStock).reduce((a, b) => a + b, 0);

    const productPayload = {
      name,
      category,
      price: parseFloat(price),
      stock: totalStock,
      sizes_stock: sizesStock,
      images,
      description,
      is_active: true,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productPayload)
        .eq("id", editingProduct.id);

      if (error) {
        console.error("UPDATE ERROR DETAILS:", error);
        alert(`Failed to update product: ${error.message}`);
      } else {
        alert("Product updated successfully!");
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert([productPayload]);

      if (error) {
        console.error("INSERT ERROR DETAILS:", error);
        alert(`Failed to create product: ${error.message}`);
      } else {
        alert("Product added successfully!");
        resetForm();
        fetchProducts();
      }
    }

    setIsSubmitting(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    await supabase.from("products").update({ is_active: !currentStatus }).eq("id", id);
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1D2128]">Products & Stock Management</h1>
          <p className="text-sm text-slate-500">Manage products and update size-wise stock quantity.</p>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-black text-[#1D2128] border-b border-gray-100 pb-3">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-black uppercase text-[#1D2128] mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton Polo"
              className="w-full rounded-2xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#215E61]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1D2128] mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#215E61]"
            >
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#1D2128] mb-1">Price (৳) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1250"
              className="w-full rounded-2xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#215E61]"
            />
          </div>

          {/* Size-wise Stock Input Grid */}
          <div className="sm:col-span-2 rounded-2xl bg-[#F4F2F2] p-4 border border-gray-200 space-y-3">
            <label className="block text-xs font-black uppercase text-[#1D2128]">
              Size-wise Stock Quantity (0 = Red Out of Stock)
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {AVAILABLE_SIZES.map((size) => (
                <div key={size} className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="block text-xs font-black text-[#215E61] mb-1">Size {size}</span>
                  <input
                    type="number"
                    min="0"
                    value={sizesStock[size] || 0}
                    onChange={(e) => handleSizeStockChange(size, e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 p-2 text-xs font-black text-center outline-none focus:border-[#FF9E20]"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-500">
              Total Combined Stock: <span className="font-black text-[#FF9E20]">{Object.values(sizesStock).reduce((a, b) => a + b, 0)} items</span>
            </p>
          </div>

          {/* Image Input */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-black uppercase text-[#1D2128]">Product Images (URL) *</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-2xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#215E61]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-2xl bg-[#215E61] px-5 py-3 text-xs font-black text-white hover:bg-[#FF9E20] hover:text-[#1D2128]"
              >
                Add Image
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase text-[#1D2128] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product fabric, details..."
              className="w-full rounded-2xl border-2 border-gray-200 p-3 text-sm outline-none focus:border-[#215E61]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-[#215E61] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
          >
            {editingProduct ? "Save Changes" : "Create Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border-2 border-gray-300 px-6 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product List Table */}
      <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-black text-[#1D2128] mb-4">All Products List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-black uppercase text-slate-500">
                <th className="py-3 px-2">Image</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Size Stock Details</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td className="py-3 px-2">
                    <img src={prod.images[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="py-3 px-2 font-bold text-[#1D2128]">{prod.name}</td>
                  <td className="py-3 px-2 font-black text-[#FF9E20]">৳{prod.price}</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {prod.sizes_stock ? (
                        Object.entries(prod.sizes_stock).map(([sz, qty]) => (
                          <span
                            key={sz}
                            className={`px-2 py-0.5 text-[10px] font-black rounded ${
                              qty > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {sz}: {qty}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Total: {prod.stock}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleToggleStatus(prod.id, prod.is_active)}
                      className={`px-3 py-1 text-xs font-black rounded-full ${
                        prod.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {prod.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="rounded-xl bg-[#215E61] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#FF9E20] hover:text-[#1D2128]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;