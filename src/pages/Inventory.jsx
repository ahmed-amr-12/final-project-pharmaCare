import {
  Plus,
  Search,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getMedicines,
  addMedicine,
} from "../services/api";

function Inventory() {
  const [medicines, setMedicines] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal,
    setShowModal] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      name: "",
      barcode: "",
      expiryDate: "",
      quantity: "",
      purchasePrice: "",
      sellingPrice: "",
      requiresPrescription: false,
      supplierId: null,
      pillCount: "",
      stripCount: "",
      manufacturer: "",
      genericName: "",
      medicineForm: "",
    });

  // ================= GET MEDICINES =================
  const fetchMedicines =
    async () => {
      try {
        const data =
          await getMedicines();

        setMedicines(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ================= DELETE MEDICINE =================
  const handleDeleteMedicine =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "متأكد إنك عايز تمسح الدواء؟"
        );

      if (!confirmDelete)
        return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `https://backendfinal-1-production.up.railway.app/api/medicines/${id}`,
            {
              method:
                "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          alert(
            data.error ||
              "فشل حذف الدواء"
          );
          return;
        }

        setMedicines(
          medicines.filter(
            (med) =>
              med.id !== id
          )
        );

        alert(
          "تم حذف الدواء ✅"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "حصل خطأ أثناء الحذف ❌"
        );
      }
    };

  // ================= ADD MEDICINE =================
  const handleAddMedicine =
    async (e) => {
      e.preventDefault();

      // Validation
      const requiredFields =
        [
          "name",
          "barcode",
          "expiryDate",
          "quantity",
          "purchasePrice",
          "sellingPrice",
          "pillCount",
          "stripCount",
          "manufacturer",
          "genericName",
          "medicineForm",
        ];

      const hasEmptyField =
        requiredFields.some(
          (
            field
          ) =>
            !formData[
              field
            ]
        );

      if (
        hasEmptyField
      ) {
        alert(
          "املى كل البيانات الأول ❌"
        );
        return;
      }

      try {
        setLoading(
          true
        );

        const response =
          await addMedicine(
            {
              ...formData,
              quantity:
                Number(
                  formData.quantity
                ),
              purchasePrice:
                Number(
                  formData.purchasePrice
                ),
              sellingPrice:
                Number(
                  formData.sellingPrice
                ),
              pillCount:
                Number(
                  formData.pillCount
                ),
              stripCount:
                Number(
                  formData.stripCount
                ),
            }
          );

        if (
          response?.error
        ) {
          alert(
            response.error
          );
          return;
        }

        await fetchMedicines();

        setFormData({
          name: "",
          barcode:
            "",
          expiryDate:
            "",
          quantity:
            "",
          purchasePrice:
            "",
          sellingPrice:
            "",
          requiresPrescription:
            false,
          supplierId:
            null,
          pillCount:
            "",
          stripCount:
            "",
          manufacturer:
            "",
          genericName:
            "",
          medicineForm:
            "",
        });

        setShowModal(
          false
        );

        alert(
          "تم إضافة الدواء ✅"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "حصل خطأ ❌"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  // ================= SEARCH =================
  const filteredMedicines =
    medicines.filter(
      (item) =>
        item.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.barcode?.includes(
          search
        )
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            المخزن
          </h1>

          <p className="text-gray-400 text-sm">
            {
              filteredMedicines.length
            }{" "}
            صنف مسجل
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }
          className="bg-gray-200 text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white transition"
        >
          <Plus size={16} />
          إضافة دواء
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-[#0b1220] text-gray-400">
              <tr>
                <th className="p-5 text-right">
                  الدواء
                </th>
                <th className="p-5 text-center">
                  الكمية
                </th>
                <th className="p-5 text-center">
                  السعر
                </th>
                <th className="p-5 text-center">
                  الصلاحية
                </th>
                <th className="p-5 text-center">
                  الشركة
                </th>
                <th className="p-5 text-center">
                  الحالة
                </th>
                <th className="p-5 text-center">
                  إجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map(
                (
                  medicine
                ) => {
                  const isLowStock =
                    medicine.quantity <=
                    10;

                  return (
                    <tr
                      key={
                        medicine.id
                      }
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-5 text-right">
                        <div className="font-bold text-white text-lg">
                          {
                            medicine.name
                          }
                        </div>

                        <div className="text-gray-400 text-sm">
                          {
                            medicine.genericName
                          }{" "}
                          •{" "}
                          {
                            medicine.medicineForm
                          }
                        </div>

                        <div className="text-gray-500 text-xs mt-2">
                          Barcode:{" "}
                          {
                            medicine.barcode
                          }
                        </div>
                      </td>

                      <td className="text-center">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            isLowStock
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {isLowStock
                            ? `ناقص ${medicine.quantity}`
                            : medicine.quantity}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="text-white font-bold">
                          {
                            medicine.sellingPrice
                          }{" "}
                          ج.م
                        </div>

                        <div className="text-gray-500 text-xs">
                          شراء{" "}
                          {
                            medicine.purchasePrice
                          }{" "}
                          ج.م
                        </div>
                      </td>

                      <td className="text-center text-gray-300">
                        {medicine.expiryDate?.split(
                          "T"
                        )[0]}
                      </td>

                      <td className="text-center text-gray-300">
                        {
                          medicine.manufacturer
                        }
                      </td>

                      <td className="text-center">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            medicine.requiresPrescription
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {medicine.requiresPrescription
                            ? "يحتاج روشتة"
                            : "بدون روشتة"}
                        </span>
                      </td>

                      <td className="flex justify-center gap-2 p-5">
                        <button className="bg-[#1e293b] hover:bg-[#334155] p-3 rounded-xl transition">
                          <Pencil
                            size={
                              16
                            }
                            className="text-gray-300"
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteMedicine(
                              medicine.id
                            )
                          }
                          className="bg-red-500/10 hover:bg-red-500/20 p-3 rounded-xl transition"
                        >
                          <Trash2
                            size={
                              16
                            }
                            className="text-red-400"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
  {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
    <div className="bg-[#111827] w-full max-w-2xl rounded-3xl border border-white/10 max-h-[90vh] overflow-hidden flex flex-col">

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
          إضافة دواء
        </h2>
      </div>

      {/* Scrollable Form */}
      <div className="overflow-y-auto p-6">
        <form
          onSubmit={
            handleAddMedicine
          }
          className="grid grid-cols-2 gap-4"
        >
          <input
            required
            type="text"
            placeholder="اسم الدواء"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="col-span-2 p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="text"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={(e) =>
              setFormData({
                ...formData,
                barcode:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="date"
            value={
              formData.expiryDate
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                expiryDate:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="number"
            placeholder="الكمية"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="number"
            placeholder="سعر الشراء"
            value={
              formData.purchasePrice
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                purchasePrice:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="number"
            placeholder="سعر البيع"
            value={
              formData.sellingPrice
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                sellingPrice:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="number"
            placeholder="عدد الحبوب"
            value={
              formData.pillCount
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                pillCount:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="number"
            placeholder="عدد الشرائط"
            value={
              formData.stripCount
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                stripCount:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="text"
            placeholder="الشركة المصنعة"
            value={
              formData.manufacturer
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                manufacturer:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="text"
            placeholder="الاسم العلمي"
            value={
              formData.genericName
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                genericName:
                  e.target.value,
              })
            }
            className="p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <input
            required
            type="text"
            placeholder="tablet / syrup"
            value={
              formData.medicineForm
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                medicineForm:
                  e.target.value,
              })
            }
            className="col-span-2 p-4 rounded-xl bg-[#0f172a] text-white border border-white/10"
          />

          <label className="col-span-2 flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={
                formData.requiresPrescription
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiresPrescription:
                    e.target.checked,
                })
              }
            />
            يحتاج روشتة
          </label>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl font-bold text-lg sticky bottom-0"
          >
            {loading
              ? "جاري الإضافة..."
              : "إضافة الدواء"}
          </button>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Inventory;