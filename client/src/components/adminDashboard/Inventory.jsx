import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  fetchSales,
  addInventoryItem,
  saleInventoryItem,
} from "../../redux/adminInventory";
import { Plus, Search } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Inventory() {
  const dispatch = useDispatch();
  const {
    items = [],
    sales = [],
    loading,
    error,
  } = useSelector((state) => state.inventory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    count: "",
    unitPrice: "",
  });
  const [saleData, setSaleData] = useState({
    itemName: "",
    count: "",
    soldTo: "student",
    soldToname: "",
    soldToId: "",
  });

  // Filter data based on search term
  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSales = sales.filter((sale) =>
    sale.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalPrice = () => {
    if (!saleData.itemName || !saleData.count) return 0;
    const selectedItem = items.find(
      (item) => item.itemName === saleData.itemName
    );
    if (!selectedItem) return 0;
    return selectedItem.unitPrice * Number(saleData.count);
  };

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchSales());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      description: "",
      count: "",
      unitPrice: "",
    });
  };

  const resetSaleForm = () => {
    setSaleData({
      itemName: "",
      count: "",
      soldTo: "student",
      soldToname: "",
      soldToId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addInventoryItem({
          ...formData,
          count: Number(formData.count),
          unitPrice: Number(formData.unitPrice),
        })
      ).unwrap();

      toast.success("Item added successfully!");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error || "Failed to add item");
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        saleInventoryItem({
          ...saleData,
          count: Number(saleData.count),
        })
      ).unwrap();

      toast.success("Sale recorded successfully!");
      setIsSaleModalOpen(false);
      resetSaleForm();
    } catch (error) {
      toast.error(error || "Failed to record sale");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex justify-between items-center mx-8 py-10">
        <div className="inline-block">
          <h1 className="text-xl font-light text-black xl:text-[38px]">
            Inventory
          </h1>
          <hr className="border-t-2 border-[#146192] mt-1" />
          <h1 className="mt-2">
            <span className="xl:text-[17px] text-xs lg:text-lg">Home</span>{" "}
            {">"}
            <span className="xl:text-[17px] text-xs md:text-lg font-medium text-[#146192]">
              Inventory
            </span>
          </h1>
        </div>
        <div className="grid md:flex gap-6">
          <button
            onClick={() => {
              setIsSaleModalOpen(true);
              resetSaleForm();
            }}
            className="bg-[#146192] text-white text-xs md:text-lg md:px-4 px-1 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#0f4c7a] transition-colors"
          >
            Sale
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
              resetForm();
            }}
            className="bg-[#146192] text-white text-xs md:text-lg md:px-4 px-1 py-2 rounded-md flex items-center gap-2 hover:bg-[#0f4c7a] transition-colors"
          >
            <Plus size={20} />
            Upload Stock
          </button>
        </div>
      </div>

      <div className="w-full md:w-96 lg:w-[440px]">
            <div className="relative mx-6 pb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Item Name"
                className="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-4 text-gray-400"
                size={20}
              />
            </div>
          </div>

      <div className="mx-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <select
            value={activeView}
            onChange={(e) => setActiveView(e.target.value)}
            className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#146192] focus:border-transparent"
          >
            <option value="inventory">Inventory Data</option>
            <option value="sales">Sales Data</option>
          </select>
        </div>
      </div>

      {/* Desktop and Laptop View - Tables */}
      <div className="mx-8 mb-6 hidden lg:block">
        {activeView === "inventory" ? (
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="min-w-full divide-y border-2">
              <thead className="bg-[#FF9F43] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Item Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Count</th>
                  <th className="px-6 py-3 text-left">Unit Price</th>
                  <th className="px-6 py-3 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody className="bg-[#EDF4FF]">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200">
                    <td className="px-6 py-4">{item.itemName}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.count}</td>
                    <td className="px-6 py-4">
                      ₹{item.unitPrice?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      ₹{item.totalPrice?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="min-w-full divide-y border-2">
              <thead className="bg-[#FF9F43] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Sno</th>
                  <th className="px-6 py-3 text-left">Item Name</th>
                  <th className="px-6 py-3 text-left">Count</th>
                  <th className="px-6 py-3 text-left">Sold To</th>
                  <th className="px-6 py-3 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody className="bg-[#EDF4FF]">
                {filteredSales.map((sale, index) => (
                  <tr key={sale._id} className="border-b border-gray-200">
                    <td className="px-6 py-4">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">{sale.itemName}</td>
                    <td className="px-6 py-4">{sale.count}</td>
                    <td className="px-6 py-4">{sale.soldTo}</td>
                    <td className="px-6 py-4">
                      ₹{sale.price?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile and Tablet View - Cards */}
      <div className="mx-8 mb-6 lg:hidden">
        <div className="space-y-6">
          {activeView === "inventory"
            ? filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="flex bg-white rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Left Panel - Orange */}
                  <div className="w-1/2 bg-[#FF9F43] p-4 text-white">
                    <div className="space-y-6">
                      <div className="font-medium">Item Name</div>
                      <div className="font-medium">Description</div>
                      <div className="font-medium">Count</div>
                      <div className="font-medium">Unit Price</div>
                      <div className="font-medium">Total Price</div>
                    </div>
                  </div>

                  {/* Right Panel - Light Blue */}
                  <div className="w-2/3 bg-[#EDF4FF] p-4">
                    <div className="space-y-6">
                      <div className="text-right">{item.itemName}</div>
                      <div className="text-right">{item.description}</div>
                      <div className="text-right">{item.count}</div>
                      <div className="text-right">
                        ₹{item.unitPrice?.toLocaleString() || 0}
                      </div>
                      <div className="text-right">
                        ₹{item.totalPrice?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : filteredSales.map((sale, index) => (
                <div
                  key={sale._id}
                  className="flex bg-white rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Left Panel - Orange */}
                  <div className="w-1/2 bg-[#FF9F43] p-4 text-white">
                    <div className="space-y-6">
                      <div className="font-medium">Sno</div>
                      <div className="font-medium">Item Name</div>
                      <div className="font-medium">Count</div>
                      <div className="font-medium">Sold To</div>
                      <div className="font-medium">Total Price</div>
                    </div>
                  </div>

                  {/* Right Panel - Light Blue */}
                  <div className="w-2/3 bg-[#EDF4FF] p-4">
                    <div className="space-y-6">
                      <div className="text-right">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="text-right">{sale.itemName}</div>
                      <div className="text-right">{sale.count}</div>
                      <div className="text-right">{sale.soldTo}</div>
                      <div className="text-right">
                        ₹{sale.price?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Upload Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-md md:text-2xl font-semibold mb-4 border-b border-[#000000]">
              Upload Stock
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Count
                </label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-4 py-2 rounded-full hover:bg-[#0f4c7a] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-md md:text-2xl font-semibold mb-4 border-b border-[#000000]">
              Sale Stock
            </h2>
            <form onSubmit={handleSaleSubmit}>
              <div className="grid grid-cols-2 gap-6 ">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                  <select
                    name="itemName"
                    value={saleData.itemName}
                    onChange={handleSaleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                  >
                    <option value="">Select an item</option>
                    {items.map((item) => (
                      <option key={item._id} value={item.itemName}>
                        {item.itemName} (Available: {item.count})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Count
                  </label>
                  <input
                    type="number"
                    name="count"
                    value={saleData.count}
                    onChange={handleSaleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                    min="1"
                    max={
                      items.find((item) => item.itemName === saleData.itemName)
                        ?.count || 1
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Price
                  </label>
                  <input
                    type="text"
                    value={`₹${calculateTotalPrice().toLocaleString()}/-`}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300 bg-gray-50"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sold To
                  </label>
                  <select
                    name="soldTo"
                    value={saleData.soldTo}
                    onChange={handleSaleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {saleData.soldTo === "student"
                      ? "Student Name"
                      : "Teacher Name"}
                  </label>
                  <input
                    type="text"
                    name="soldToname"
                    value={saleData.soldToname}
                    onChange={handleSaleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {saleData.soldTo === "student"
                      ? "Registration No"
                      : "Employee ID"}
                  </label>
                  <input
                    type="text"
                    name="soldToId"
                    value={saleData.soldToId}
                    onChange={handleSaleInputChange}
                    className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSaleModalOpen(false);
                    resetSaleForm();
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146192] text-white px-4 py-2 rounded-full hover:bg-[#0f4c7a] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Inventory;