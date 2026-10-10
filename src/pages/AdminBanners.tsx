import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface IBanner {
  id: number;
  created_at: string;
  title: string | null;
  image_url: string;
  link_type: string;
  link_value: string | null;
  display_order: number;
  is_active: boolean;
}

const AdminBanners = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkType, setLinkType] = useState("shop");
  const [linkValue, setLinkValue] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Edit state
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.log("BANNER FETCH ERROR:", error);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    setLinkType("shop");
    setLinkValue("");
    setDisplayOrder(0);
    setIsActive(true);
    setEditingBanner(null);
  };

  // Storage url theke path khuje ber kora permanent delete-er jonno
  const getStoragePathFromUrl = (url: string) => {
    const parts = url.split("/banner-img/");
    return parts.length > 1 ? parts[1] : null;
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = editingBanner?.image_url || "";

      // 1. Notun image choose korle Storage-e upload hobe
      if (imageFile) {
        // Edit korar shomoy purono image delete hobe jeno free storage bache
        if (editingBanner?.image_url) {
          const oldPath = getStoragePathFromUrl(editingBanner.image_url);
          if (oldPath) {
            await supabase.storage.from("banner-img").remove([oldPath]);
          }
        }

        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("banner-img")
          .upload(filePath, imageFile);

        if (uploadError) {
          alert("Image upload failed!");
          setUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("banner-img")
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      if (!finalImageUrl) {
        alert("Please select a banner image!");
        setUploading(false);
        return;
      }

      // 2. Database Insert / Update
      if (editingBanner) {
        const { error } = await supabase
          .from("banners")
          .update({
            title: title || null,
            image_url: finalImageUrl,
            link_type: linkType,
            link_value: linkValue || null,
            display_order: Number(displayOrder),
            is_active: isActive,
          })
          .eq("id", editingBanner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert({
          title: title || null,
          image_url: finalImageUrl,
          link_type: linkType,
          link_value: linkValue || null,
          display_order: Number(displayOrder),
          is_active: isActive,
        });

        if (error) throw error;
      }

      resetForm();
      fetchBanners();
    } catch (err) {
      console.log("SAVE BANNER ERROR:", err);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setLinkType(banner.link_type);
    setLinkValue(banner.link_value || "");
    setDisplayOrder(banner.display_order);
    setIsActive(banner.is_active);
  };

  const handleDelete = async (banner: IBanner) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      // 1. Storage theke image permanantly delete kora
      const storagePath = getStoragePathFromUrl(banner.image_url);
      if (storagePath) {
        await supabase.storage.from("banner-img").remove([storagePath]);
      }

      // 2. Database row delete kora
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", banner.id);

      if (error) throw error;

      fetchBanners();
    } catch (err) {
      console.log("DELETE BANNER ERROR:", err);
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Banner Management</h1>
        <p className="mt-1 text-slate-500">
          Upload and manage homepage hero banner slides
        </p>
      </div>

      {/* Form Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          {editingBanner ? "Edit Banner" : "Add New Banner"}
        </h2>

        <form onSubmit={handleSaveBanner} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Banner Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Collection Offer"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Link Type
              </label>
              <select
                value={linkType}
                onChange={(e) => setLinkType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-teal-600"
              >
                <option value="shop">Shop Page (/shop)</option>
                <option value="category">Category Filter</option>
                <option value="product">Specific Product</option>
                <option value="custom">Custom Route</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Link Value
              </label>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder={
                  linkType === "category"
                    ? "T-Shirts"
                    : linkType === "product"
                    ? "Product ID (e.g. 5)"
                    : "e.g. /shop"
                }
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Banner Image (Recommended 16:7 aspect ratio)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Active Banner
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
            >
              {uploading ? "Saving..." : editingBanner ? "Update Banner" : "Add Banner"}
            </button>

            {editingBanner && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banners List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Existing Banners</h2>

        {loading ? (
          <p className="text-slate-500">Loading banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-slate-500">No banners created yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title || "Banner"}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        banner.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-slate-500">
                      Order: {banner.display_order}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-800 truncate">
                    {banner.title || "Untitled Banner"}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Link: {banner.link_type} ({banner.link_value || "N/A"})
                  </p>

                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 rounded-lg bg-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      className="flex-1 rounded-lg bg-red-100 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;