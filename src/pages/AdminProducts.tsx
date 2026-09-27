import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // ADD PRODUCT
  // =========================

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);

  // =========================
  // EDIT PRODUCT
  // =========================

  const [editingProduct, setEditingProduct] =
    useState<IProduct | null>(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editActive, setEditActive] = useState(true);

  const [editImages, setEditImages] = useState<string[]>([]);
  const [editNewImages, setEditNewImages] = useState<File[]>([]);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("PRODUCT FETCH ERROR:", error);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productStock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const imageUrls: string[] = [];

      for (const image of productImages) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("product-img")
            .upload(fileName, image);

        if (uploadError) {
          console.log(
            "IMAGE UPLOAD ERROR:",
            uploadError
          );

          alert(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("product-img")
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }

      const {
        data: newProduct,
        error: productError,
      } = await supabase
        .from("products")
        .insert({
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          description: productDescription,
          images: imageUrls,
          stock: Number(productStock),
          is_active: true,
        })
        .select();

      if (productError) {
        console.log(
          "PRODUCT INSERT ERROR:",
          productError
        );

        alert(productError.message);
        return;
      }

      if (newProduct && newProduct.length > 0) {
        setProducts((currentProducts) => [
          newProduct[0],
          ...currentProducts,
        ]);
      }

      setProductName("");
      setProductPrice("");
      setProductCategory("");
      setProductDescription("");
      setProductStock("");
      setProductImages([]);

      alert("Product added successfully!");
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);
      alert("Something went wrong.");
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditClick = (
    product: IProduct
  ) => {
    setEditingProduct(product);

    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditCategory(product.category);
    setEditDescription(product.description || "");
    setEditStock(String(product.stock));
    setEditActive(product.is_active);

    setEditImages(
      product.images ? [...product.images] : []
    );

    setEditNewImages([]);
  };

  // =========================
  // REMOVE EXISTING IMAGE
  // =========================

  const handleRemoveEditImage = (
    imageUrl: string
  ) => {
    setEditImages((currentImages) =>
      currentImages.filter(
        (image) => image !== imageUrl
      )
    );
  };

  // =========================
  // NEW EDIT IMAGES
  // =========================

  const handleEditNewImages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    setEditNewImages(files);
  };

  // =========================
  // GET STORAGE PATH
  // =========================

  const getStoragePathFromUrl = (
    imageUrl: string
  ): string | null => {
    try {
      const url = new URL(imageUrl);

      const pathPrefix =
        "/storage/v1/object/public/product-img/";

      if (!url.pathname.startsWith(pathPrefix)) {
        return null;
      }

      const encodedPath =
        url.pathname.substring(
          pathPrefix.length
        );

      return decodeURIComponent(encodedPath);
    } catch (error) {
      console.log(
        "IMAGE URL PARSE ERROR:",
        error
      );

      return null;
    }
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (
      !editName ||
      !editPrice ||
      !editCategory ||
      !editStock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const oldImages =
        editingProduct.images || [];

      const removedImages =
        oldImages.filter(
          (oldImage) =>
            !editImages.includes(oldImage)
        );

      const removedFilePaths: string[] = [];

      removedImages.forEach(
        (imageUrl) => {
          const path =
            getStoragePathFromUrl(imageUrl);

          if (path) {
            removedFilePaths.push(path);
          }
        }
      );

      if (removedFilePaths.length > 0) {
        const {
          error: storageDeleteError,
        } = await supabase.storage
          .from("product-img")
          .remove(removedFilePaths);

        if (storageDeleteError) {
          console.log(
            "IMAGE DELETE ERROR:",
            storageDeleteError
          );

          alert(
            "Some images could not be deleted."
          );

          return;
        }
      }

      const newImageUrls: string[] = [];

      for (const image of editNewImages) {
        const fileName = `${Date.now()}-${image.name}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("product-img")
          .upload(fileName, image);

        if (uploadError) {
          console.log(
            "NEW IMAGE UPLOAD ERROR:",
            uploadError
          );

          alert(uploadError.message);
          return;
        }

        const { data } =
          supabase.storage
            .from("product-img")
            .getPublicUrl(fileName);

        newImageUrls.push(data.publicUrl);
      }

      const finalImages = [
        ...editImages,
        ...newImageUrls,
      ];

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .update({
          name: editName,
          price: Number(editPrice),
          category: editCategory,
          description: editDescription,
          stock: Number(editStock),
          is_active: editActive,
          images: finalImages,
        })
        .eq(
          "id",
          editingProduct.id
        )
        .select();

      if (error) {
        console.log(
          "PRODUCT UPDATE ERROR:",
          error
        );

        alert(error.message);
        return;
      }

      if (data && data.length > 0) {
        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product.id === editingProduct.id
                  ? data[0]
                  : product
            )
        );
      }

      alert(
        "Product updated successfully!"
      );

      setEditingProduct(null);
      setEditImages([]);
      setEditNewImages([]);
    } catch (error) {
      console.log(
        "UPDATE PRODUCT ERROR:",
        error
      );

      alert(
        "Something went wrong while updating the product."
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (
    productId: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product and all its images?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const {
        data: product,
        error: fetchError,
      } = await supabase
        .from("products")
        .select("images")
        .eq("id", productId)
        .single();

      if (fetchError) {
        console.log(
          "PRODUCT FETCH ERROR:",
          fetchError
        );

        alert(fetchError.message);
        return;
      }

      const filePaths: string[] = [];

      if (
        product?.images &&
        product.images.length > 0
      ) {
        product.images.forEach(
          (imageUrl: string) => {
            const path =
              getStoragePathFromUrl(imageUrl);

            if (path) {
              filePaths.push(path);
            }
          }
        );
      }

      if (filePaths.length > 0) {
        const {
          data: deletedFiles,
          error: storageError,
        } = await supabase.storage
          .from("product-img")
          .remove(filePaths);

        if (storageError) {
          alert(
            "Images could not be deleted from Storage. Product was not deleted."
          );

          return;
        }

        if (
          !deletedFiles ||
          deletedFiles.length === 0
        ) {
          alert(
            "Supabase did not delete the images."
          );

          return;
        }
      }

      const {
        error: deleteError,
      } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) {
        console.log(
          "PRODUCT DELETE ERROR:",
          deleteError
        );

        alert(deleteError.message);
        return;
      }

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== productId
          )
      );

      alert(
        "Product and all its images deleted successfully!"
      );
    } catch (error) {
      console.log(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        "Something went wrong while deleting the product."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">
          Loading products...
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* HEADER */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
          Teal Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Products
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add, edit and manage your Teal products.
        </p>
      </div>

      {/* ADD PRODUCT */}

      <section className="mb-8 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Add New Product
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new product for your store.
          </p>
        </div>

        <form
          onSubmit={handleAddProduct}
          className="grid gap-5 md:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="Classic T-Shirt"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              value={productPrice}
              onChange={(e) =>
                setProductPrice(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="650"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              value={productCategory}
              onChange={(e) =>
                setProductCategory(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="T-Shirt"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Stock
            </label>

            <input
              type="number"
              value={productStock}
              onChange={(e) =>
                setProductStock(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={productDescription}
              onChange={(e) =>
                setProductDescription(e.target.value)
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="Product description..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setProductImages(
                  Array.from(
                    e.target.files || []
                  )
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md"
            >
              Add Product
            </button>
          </div>
        </form>
      </section>

      {/* EDIT PRODUCT */}

      {editingProduct && (
        <section className="mb-8 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Edit Product
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update product information and images.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setEditImages([]);
                setEditNewImages([]);
              }}
              className="rounded-xl bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleUpdateProduct}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                value={editPrice}
                onChange={(e) =>
                  setEditPrice(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                value={editStock}
                onChange={(e) =>
                  setEditStock(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Current Images
              </label>

              {editImages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No images selected.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {editImages.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`${editName} ${index + 1}`}
                          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveEditImage(
                              image
                            )
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Add New Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleEditNewImages}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm"
              />

              {editNewImages.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {editNewImages.length} new image
                  {editNewImages.length > 1
                    ? "s"
                    : ""}{" "}
                  selected.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) =>
                    setEditActive(
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-teal-700"
                />

                <span className="text-sm font-medium text-gray-700">
                  Product is active
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md"
              >
                Update Product
              </button>
            </div>
          </form>
        </section>
      )}

      {/* PRODUCTS */}

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {products.length} product
            {products.length !== 1 ? "s" : ""} in your store
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-teal-200 bg-white py-16 text-center">
            <p className="text-gray-500">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-teal-50">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                        {product.category}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {product.name}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        product.is_active
                          ? "bg-teal-50 text-teal-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p className="text-xl font-bold text-gray-900">
                    ৳{product.price}
                  </p>

                  <div className="mt-3">
                    {product.stock === 0 ? (
                      <span className="text-sm font-semibold text-red-500">
                        Out of Stock
                      </span>
                    ) : product.stock === 1 ? (
                      <span className="text-sm font-semibold text-orange-500">
                        Only 1 left
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {product.stock} in stock
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() =>
                        handleEditClick(product)
                      }
                      className="flex-1 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-teal-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          product.id
                        )
                      }
                      className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminProducts;