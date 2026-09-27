import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { IOrder } from "../types/order";
import type { IProduct } from "../types/product";

const AdminDashboard = () => {
  // =========================
  // ORDERS
  // =========================

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

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

  // Existing images that are currently kept
  const [editImages, setEditImages] = useState<string[]>([]);

  // New images selected during edit
  const [editNewImages, setEditNewImages] = useState<File[]>([]);

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("ORDER FETCH ERROR:", error);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

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
      setProductsLoading(false);
      return;
    }

    setProducts(data || []);
    setProductsLoading(false);
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin-login";
  };

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

      // Upload images
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

      // Insert product
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

      if (
        newProduct &&
        newProduct.length > 0
      ) {
        setProducts((currentProducts) => [
          newProduct[0],
          ...currentProducts,
        ]);
      }

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductCategory("");
      setProductDescription("");
      setProductStock("");
      setProductImages([]);

      alert("Product added successfully!");
    } catch (error) {
      console.log(
        "ADD PRODUCT ERROR:",
        error
      );

      alert("Something went wrong.");
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditClick = (
    product: IProduct
  ) => {
    console.log(
      "EDIT BUTTON CLICKED:",
      product
    );

    setEditingProduct(product);

    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditCategory(product.category);
    setEditDescription(
      product.description || ""
    );
    setEditStock(String(product.stock));
    setEditActive(product.is_active);

    // Load existing images
    setEditImages(
      product.images
        ? [...product.images]
        : []
    );

    // Clear previously selected new images
    setEditNewImages([]);
  };

  // =========================
  // REMOVE EXISTING EDIT IMAGE
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

      return decodeURIComponent(
        encodedPath
      );
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
      alert(
        "Please fill in all required fields."
      );

      return;
    }

    try {
      console.log(
        "UPDATING PRODUCT:",
        editingProduct.id
      );

      // ---------------------------------
      // 1. Find removed images
      // ---------------------------------

      const oldImages =
        editingProduct.images || [];

      const removedImages =
        oldImages.filter(
          (oldImage) =>
            !editImages.includes(oldImage)
        );

      console.log(
        "REMOVED IMAGES:",
        removedImages
      );

      // ---------------------------------
      // 2. Delete removed images
      // ---------------------------------

      const removedFilePaths: string[] = [];

      removedImages.forEach(
        (imageUrl) => {
          const path =
            getStoragePathFromUrl(
              imageUrl
            );

          if (path) {
            removedFilePaths.push(path);
          }
        }
      );

      console.log(
        "REMOVED STORAGE PATHS:",
        removedFilePaths
      );

      if (
        removedFilePaths.length > 0
      ) {
        const {
          data: deletedFiles,
          error: storageDeleteError,
        } = await supabase.storage
          .from("product-img")
          .remove(
            removedFilePaths
          );

        console.log(
          "DELETED EDIT IMAGES:",
          deletedFiles
        );

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

      // ---------------------------------
      // 3. Upload new images
      // ---------------------------------

      const newImageUrls: string[] = [];

      for (const image of editNewImages) {
        const fileName = `${Date.now()}-${image.name}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("product-img")
          .upload(
            fileName,
            image
          );

        if (uploadError) {
          console.log(
            "NEW IMAGE UPLOAD ERROR:",
            uploadError
          );

          alert(
            uploadError.message
          );

          return;
        }

        const { data } =
          supabase.storage
            .from("product-img")
            .getPublicUrl(
              fileName
            );

        newImageUrls.push(
          data.publicUrl
        );
      }

      console.log(
        "NEW IMAGE URLS:",
        newImageUrls
      );

      // ---------------------------------
      // 4. Combine existing + new images
      // ---------------------------------

      const finalImages = [
        ...editImages,
        ...newImageUrls,
      ];

      console.log(
        "FINAL PRODUCT IMAGES:",
        finalImages
      );

      // ---------------------------------
      // 5. Update product
      // ---------------------------------

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

      console.log(
        "UPDATED PRODUCT:",
        data
      );

      // ---------------------------------
      // 6. Update UI
      // ---------------------------------

      if (
        data &&
        data.length > 0
      ) {
        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product.id ===
                editingProduct.id
                  ? data[0]
                  : product
            )
        );
      }

      alert(
        "Product updated successfully!"
      );

      // ---------------------------------
      // 7. Reset edit state
      // ---------------------------------

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
  // DELETE PRODUCT + STORAGE IMAGES
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
      // 1. Get product images
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

      console.log(
        "PRODUCT IMAGES FROM DATABASE:",
        product?.images
      );

      // 2. Convert image URLs to Storage paths
      const filePaths: string[] = [];

      if (
        product?.images &&
        product.images.length > 0
      ) {
        product.images.forEach(
          (imageUrl: string) => {
            const path =
              getStoragePathFromUrl(
                imageUrl
              );

            if (path) {
              filePaths.push(path);
            }
          }
        );
      }

      console.log(
        "FILES TO DELETE FROM STORAGE:",
        filePaths
      );

      // 3. Delete images
      if (filePaths.length > 0) {
        const {
          data: deletedFiles,
          error: storageError,
        } = await supabase.storage
          .from("product-img")
          .remove(filePaths);

        console.log(
          "DELETED STORAGE FILES:",
          deletedFiles
        );

        console.log(
          "STORAGE DELETE ERROR:",
          storageError
        );

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

      // 4. Delete product
      const {
        error: deleteError,
      } = await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          productId
        );

      if (deleteError) {
        console.log(
          "PRODUCT DELETE ERROR:",
          deleteError
        );

        alert(
          deleteError.message
        );

        return;
      }

      // 5. Remove from UI
      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !==
              productId
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
  // UPDATE ORDER STATUS
  // =========================

  const handleOrderStatusChange = async (
    orderId: number,
    newStatus: IOrder["status"]
  ) => {
    const { error } =
      await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq(
          "id",
          orderId
        );

    if (error) {
      console.log(
        "ORDER STATUS UPDATE ERROR:",
        error
      );

      alert(error.message);
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status:
                    newStatus,
                }
              : order
        )
    );
  };

  // =========================
  // LOADING
  // =========================

  if (
    loading ||
    productsLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Teal Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        {/* SUMMARY */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {orders.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {products.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Active Products
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {
                products.filter(
                  (product) =>
                    product.is_active
                ).length
              }
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "pending"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* ADD PRODUCT */}

        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">
            Add New Product
          </h2>

          <form
            onSubmit={
              handleAddProduct
            }
            className="grid gap-5 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name
              </label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Classic T-Shirt"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Price
              </label>

              <input
                type="number"
                value={productPrice}
                onChange={(e) =>
                  setProductPrice(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="650"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <input
                type="text"
                value={productCategory}
                onChange={(e) =>
                  setProductCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="T-Shirt"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock
              </label>

              <input
                type="number"
                value={productStock}
                onChange={(e) =>
                  setProductStock(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={
                  productDescription
                }
                onChange={(e) =>
                  setProductDescription(
                    e.target.value
                  )
                }
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Product description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Product Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setProductImages(
                    Array.from(
                      e.target.files ||
                        []
                    )
                  )
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Add Product
              </button>
            </div>

          </form>
        </section>

        {/* EDIT PRODUCT */}

        {editingProduct && (
          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Edit Product
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(
                    null
                  );
                  setEditImages([]);
                  setEditNewImages(
                    []
                  );
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>

            <form
              onSubmit={
                handleUpdateProduct
              }
              className="grid gap-5 md:grid-cols-2"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) =>
                    setEditCategory(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  value={editStock}
                  onChange={(e) =>
                    setEditStock(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="md:col-span-2">

                <label className="mb-3 block text-sm font-medium">
                  Current Images
                </label>

                {editImages.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    No images selected.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                    {editImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative overflow-hidden rounded-xl border"
                        >

                          <img
                            src={image}
                            alt={`${editName} ${index + 1}`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveEditImage(
                                image
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600"
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

                <label className="mb-2 block text-sm font-medium">
                  Add New Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleEditNewImages
                  }
                  className="w-full rounded-lg border p-3"
                />

                {editNewImages.length >
                  0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {
                      editNewImages.length
                    }{" "}
                    new image
                    {editNewImages.length >
                    1
                      ? "s"
                      : ""}{" "}
                    selected.
                  </p>
                )}

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={
                    editDescription
                  }
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              <div className="md:col-span-2">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      editActive
                    }
                    onChange={(e) =>
                      setEditActive(
                        e.target
                          .checked
                      )
                    }
                    className="h-5 w-5"
                  />

                  <span className="text-sm font-medium">
                    Product is active
                  </span>

                </label>

              </div>

              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
                >
                  Update Product
                </button>

              </div>

            </form>

          </section>
        )}

        {/* PRODUCTS */}

        <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your Teal products
            </p>
          </div>

          {products.length ===
          0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No products found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {products.map(
                (product) => (

                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl border bg-white"
                  >

                    {/* IMAGE */}

                    <div className="aspect-square bg-gray-100">

                      {product.images?.[0] ? (
                        <img
                          src={
                            product
                              .images[0]
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* INFO */}

                    <div className="p-5">

                      <div className="mb-2 flex items-start justify-between gap-3">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {
                              product.category
                            }
                          </p>

                          <h3 className="mt-1 text-lg font-bold">
                            {
                              product.name
                            }
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      <p className="text-xl font-bold">
                        ৳
                        {
                          product.price
                        }
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Stock:{" "}
                        {
                          product.stock
                        }
                      </p>

                      {/* BUTTONS */}

                      <div className="mt-5 flex gap-3">

                        <button
                          onClick={() =>
                            handleEditClick(
                              product
                            )
                          }
                          className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                          className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </section>

        {/* ORDERS */}

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders
            </p>
          </div>

          {orders.length ===
          0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {orders.map(
                (order) => (

                  <div
                    key={order.id}
                    className="rounded-2xl border p-5"
                  >

                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>
                        <p className="text-sm text-gray-500">
                          Order #
                          {
                            order.id
                          }
                        </p>

                        <h3 className="mt-1 text-lg font-bold">
                          {
                            order.customer_name
                          }
                        </h3>
                      </div>

                      <select
                        value={
                          order.status
                        }
                        onChange={(
                          e
                        ) =>
                          handleOrderStatusChange(
                            order.id,
                            e.target
                              .value as IOrder["status"]
                          )
                        }
                        className="rounded-lg border px-4 py-2"
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                    <div className="grid gap-3 text-sm md:grid-cols-3">

                      <div>
                        <p className="text-gray-500">
                          Phone
                        </p>

                        <p className="font-medium">
                          {
                            order.phone
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">
                          Address
                        </p>

                        <p className="font-medium">
                          {
                            order.address
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">
                          Total
                        </p>

                        <p className="font-bold">
                          ৳
                          {
                            order.total_price
                          }
                        </p>
                      </div>

                    </div>

                    {order.note && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">

                        <p className="text-sm text-gray-500">
                          Note
                        </p>

                        <p className="mt-1 text-sm">
                          {
                            order.note
                          }
                        </p>

                      </div>
                    )}

                    <div className="mt-5">

                      <p className="mb-3 font-semibold">
                        Products
                      </p>

                      <div className="space-y-2">

                        {order.items.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={
                                index
                              }
                              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm"
                            >

                              <span>
                                {
                                  item.name
                                }{" "}
                                ×{" "}
                                {
                                  item.quantity
                                }
                              </span>

                              <span className="font-medium">
                                ৳
                                {
                                  item.price *
                                  item.quantity
                                }
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
};

export default AdminDashboard;