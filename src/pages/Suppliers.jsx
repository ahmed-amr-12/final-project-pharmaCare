import {
  Plus,
  Search,
  Phone,
  MapPin,
  Truck,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getSuppliers,
  addSupplier,
  deleteSupplier,
} from "../services/api";

function Suppliers() {
  const [suppliers, setSuppliers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone1: "",
      phone2: "",
      address: "",
    });

  // ======================
  // GET SUPPLIERS
  // ======================
  const fetchSuppliers =
    async () => {
      try {
        const data =
          await getSuppliers();

        setSuppliers(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.log(error);

        if (
          error?.response
            ?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          window.location.href =
            "/login";
        }
      }
    };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ======================
  // ADD SUPPLIER
  // ======================
  const handleAddSupplier =
    async (e) => {
      e.preventDefault();

      if (
        !formData.name ||
        !formData.phone1 ||
        !formData.address
      ) {
        alert(
          "املى كل البيانات المطلوبة"
        );
        return;
      }

      try {
        setLoading(true);

        const payload = {
          name: formData.name,

          phones: [
            formData.phone1,
            formData.phone2,
          ].filter(Boolean),

          address:
            formData.address,
        };

        const response =
          await addSupplier(
            payload
          );

        if (
          response?.error
        ) {
          alert(
            response.error
          );
          return;
        }

        alert(
          "تم إضافة المورد ✅"
        );

        setFormData({
          name: "",
          phone1: "",
          phone2: "",
          address: "",
        });

        setShowModal(
          false
        );

        fetchSuppliers();
      } catch (error) {
        console.log(error);

        alert(
          "فشل إضافة المورد ❌"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  // ======================
  // DELETE SUPPLIER
  // ======================
  const handleDeleteSupplier =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "متأكد انك عايز تمسح المورد؟"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteSupplier(
          id
        );

        setSuppliers(
          suppliers.filter(
            (
              supplier
            ) =>
              supplier.id !==
              id
          )
        );

        alert(
          "تم حذف المورد ✅"
        );
      } catch (error) {
        console.log(error);

        alert(
          "فشل حذف المورد ❌"
        );
      }
    };

  // ======================
  // SEARCH
  // ======================
  const filteredSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        supplier.address
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            الموردين
          </h1>

          <p className="text-gray-400 text-sm">
            {
              filteredSuppliers.length
            }{" "}
            مورد
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }
          className="bg-white text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition"
        >
          <Plus size={16} />
          إضافة مورد
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center bg-[#111827] border border-white/10 rounded-xl px-4 py-3 w-full md:w-[350px]">
        <Search
          size={18}
          className="text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="بحث..."
          className="bg-transparent outline-none text-sm px-2 w-full text-gray-300"
        />
      </div>

{/* ADD SUPPLIER MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
    <div className="bg-[#111827] w-full max-w-xl rounded-3xl border border-white/10 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <button
          onClick={() =>
            setShowModal(false)
          }
          className="text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-white text-2xl font-bold">
          إضافة مورد
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={
          handleAddSupplier
        }
        className="p-6 space-y-4"
      >
        <input
          required
          type="text"
          placeholder="اسم المورد"
          value={
            formData.name
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target.value,
            })
          }
          className="w-full p-4 rounded-xl bg-[#0f172a] text-white border border-white/10 outline-none"
        />

        <input
          required
          type="text"
          placeholder="رقم الهاتف الأساسي"
          value={
            formData.phone1
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              phone1:
                e.target.value,
            })
          }
          className="w-full p-4 rounded-xl bg-[#0f172a] text-white border border-white/10 outline-none"
        />

        <input
          type="text"
          placeholder="رقم إضافي (اختياري)"
          value={
            formData.phone2
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              phone2:
                e.target.value,
            })
          }
          className="w-full p-4 rounded-xl bg-[#0f172a] text-white border border-white/10 outline-none"
        />

        <input
          required
          type="text"
          placeholder="العنوان"
          value={
            formData.address
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              address:
                e.target.value,
            })
          }
          className="w-full p-4 rounded-xl bg-[#0f172a] text-white border border-white/10 outline-none"
        />

        <button
          type="submit"
          disabled={
            loading
          }
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl font-bold text-lg"
        >
          {loading
            ? "جاري الإضافة..."
            : "إضافة المورد"}
        </button>
      </form>
    </div>
  </div>
)}
      {/* SUPPLIERS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(
          (
            supplier
          ) => (
            <div
              key={
                supplier.id
              }
              className="bg-[#111827] border border-white/10 rounded-3xl p-5"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-3 rounded-xl">
                    <Truck
                      size={
                        18
                      }
                      className="text-blue-400"
                    />
                  </div>

                  <h2 className="text-white font-semibold text-lg">
                    {
                      supplier.name
                    }
                  </h2>
                </div>

                <button
                  onClick={() =>
                    handleDeleteSupplier(
                      supplier.id
                    )
                  }
                  className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-xl"
                >
                  <Trash2
                    size={
                      16
                    }
                    className="text-red-400"
                  />
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-2">
                  <Phone
                    size={
                      14
                    }
                  />

                  <div>
                    {supplier.phones?.map(
                      (
                        phone,
                        index
                      ) => (
                        <p
                          key={
                            index
                          }
                        >
                          {
                            phone
                          }
                        </p>
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <MapPin
                    size={
                      14
                    }
                  />
                  {
                    supplier.address
                  }
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Suppliers;