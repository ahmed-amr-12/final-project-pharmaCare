import {
  ShoppingCart,
  Search,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  searchMedicineByBarcode,
  getMedicines,
  createSale,
} from "../services/api";

function Pos() {
  const [barcode, setBarcode] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [cart, setCart] =
    useState([]);

  const [medicines, setMedicines] =
    useState([]);

  const [paymentMethod,
    setPaymentMethod] =
    useState("cash");

  // =====================
  // GET MEDICINES
  // =====================
  useEffect(() => {
    const fetchMedicines =
      async () => {
        try {
          const data =
            await getMedicines();

          setMedicines(
            data || []
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchMedicines();
  }, []);

  // =====================
  // ADD TO CART
  // =====================
  const addToCart = (
    medicine
  ) => {
    const existingItem =
      cart.find(
        (item) =>
          item.id ===
          medicine.id
      );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id ===
          medicine.id
            ? {
                ...item,
                qty:
                  item.qty + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...medicine,
          qty: 1,
        },
      ]);
    }
  };

  // =====================
  // REMOVE ITEM
  // =====================
  const removeItem = (id) => {
    setCart(
      cart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // =====================
  // BARCODE SEARCH
  // =====================
  const handleBarcodeSearch =
    async (e) => {
      if (e.key !== "Enter")
        return;

      if (!barcode.trim())
        return;

      try {
        const response =
          await searchMedicineByBarcode(
            barcode
          );

        const medicine =
          response.data ||
          response;

        if (
          !medicine ||
          !medicine.id
        ) {
          alert(
            "الدواء غير موجود"
          );
          return;
        }

        addToCart(
          medicine
        );

        setBarcode("");
      } catch (error) {
        console.log(error);
      }
    };

  // =====================
  // FILTER SEARCH
  // =====================
  const filteredMedicines =
    medicines.filter(
      (medicine) =>
        medicine.name
          ?.toLowerCase()
          .includes(
            search
              .toLowerCase()
              .trim()
          ) ||
        medicine.barcode
          ?.toString()
          .includes(
            search.trim()
          )
    );

  // =====================
  // TOTAL
  // =====================
  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.sellingPrice *
          item.qty,
      0
    );
// =====================
// =====================
// CHECKOUT
// =====================
const handleCheckout =
  async () => {
    if (
      cart.length === 0
    ) {
      alert(
        "السلة فارغة"
      );
      return;
    }

    const saleData = {
      paymentMethod:
        paymentMethod,

      items: cart.map(
        (item) => ({
          medicineId:
            item.id,

          qty:
            item.qty,

          quantityType:
            "box",
        })
      ),
    };

    try {
      // أول محاولة للبيع
      const response =
        await createSale(
          saleData
        );

      console.log(
        "SALE RESPONSE:",
        response
      );

      // =====================
      // لو فيه تعارض دوائي
      // =====================
      if (
        response?.error?.includes(
          "تعارض"
        )
      ) {
        // دي بتطلع Yes / No
        const shouldContinue =
          window.confirm(
            `${response.error}

هل تريد إكمال عملية البيع؟`
          );

        // NO
        if (
          !shouldContinue
        ) {
          alert(
            "تم إلغاء العملية ❌"
          );
          return;
        }

        // YES
        const forceSale =
          await createSale({
            ...saleData,
            forceInteraction:
              true,
          });

        console.log(
          "FORCE SALE:",
          forceSale
        );

        if (
          forceSale?.error
        ) {
          alert(
            forceSale.error
          );
          return;
        }

        alert(
          "تمت عملية البيع بنجاح ✅"
        );

        // تنظيف
        setCart([]);
        setSearch("");
        setBarcode("");

        return;
      }

      // Error عادي
      if (
        response?.error
      ) {
        alert(
          response.error
        );
        return;
      }

      // نجاح طبيعي
      alert(
        "تمت عملية البيع بنجاح ✅"
      );

      setCart([]);
      setSearch("");
      setBarcode("");

    } catch (error) {
      console.log(error);

      // لو backend رجع 409 تعارض
      if (
        error?.response
          ?.status ===
        409
      ) {
        const shouldContinue =
          window.confirm(
            "يوجد تعارض دوائي\n\nهل تريد إكمال عملية البيع؟"
          );

        // NO
        if (
          !shouldContinue
        ) {
          return;
        }

        // YES
        try {
          const forceSale =
            await createSale({
              ...saleData,
              forceInteraction:
                true,
            });

          console.log(
            "FORCE SALE:",
            forceSale
          );

          alert(
            "تمت عملية البيع بنجاح ✅"
          );

          // تنظيف
          setCart([]);
          setSearch("");
          setBarcode("");

        } catch (
          forceError
        ) {
          console.log(
            forceError
          );

          alert(
            "فشل عملية البيع ❌"
          );
        }

        return;
      }

      alert(
        "فشل عملية البيع ❌"
      );
    }
  };


  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* CART */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex flex-col">

        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-2 text-white font-bold">
            <ShoppingCart size={18} />
            سلة المشتريات
          </h2>

          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
            {cart.length} أصناف
          </span>
        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-auto space-y-3">
          {cart.length ===
          0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <ShoppingCart size={40} />
              <p className="mt-3 text-sm">
                السلة فارغة
              </p>
            </div>
          ) : (
            cart.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="bg-[#0b1220] rounded-xl p-3 border border-white/10"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-white font-semibold">
                        {
                          item.name
                        }
                      </h3>

                      <p className="text-sm text-gray-400">
                        {
                          item.barcode
                        }
                      </p>

                      <p className="text-green-400 text-sm">
                        {item.qty} ×{" "}
                        {
                          item.sellingPrice
                        }{" "}
                        ج.م
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                    >
                      <Trash2
                        className="text-red-400"
                        size={18}
                      />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 pt-4 mt-4 space-y-4">

          <div className="flex justify-between text-white">
            <span>
              الإجمالي
            </span>

            <span className="font-bold text-lg">
              ج.م{" "}
              {total.toFixed(
                2
              )}
            </span>
          </div>

          <select
            value={
              paymentMethod
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            className="w-full bg-[#0b1220] border border-white/10 rounded-xl p-3 text-gray-300"
          >
            <option value="cash">
              كاش
            </option>

            <option value="card">
              فيزا
            </option>
          </select>

          <button
            onClick={
              handleCheckout
            }
            disabled={
              !cart.length
            }
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              cart.length
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 opacity-50 cursor-not-allowed"
            }`}
          >
            دفع{" "}
            {paymentMethod ===
            "cash"
              ? "كاش"
              : "فيزا"}{" "}
            - ج.م{" "}
            {total.toFixed(
              2
            )}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-2 space-y-6">

        {/* BARCODE */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-3">
            قارئ الباركود
          </h2>

          <input
            type="text"
            value={
              barcode
            }
            onChange={(e) =>
              setBarcode(
                e.target.value
              )
            }
            onKeyDown={
              handleBarcodeSearch
            }
            placeholder="امسح الباركود هنا..."
            className="w-full bg-[#0b1220] border border-white/10 rounded-lg p-3 text-gray-300"
          />
        </div>

        {/* SEARCH */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-4">
            <Search
              size={18}
              className="text-gray-400"
            />

            <h2 className="text-white font-bold">
              بحث يدوي
            </h2>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="ابحث بالاسم أو الباركود..."
            className="w-full bg-[#0b1220] border border-white/10 rounded-lg p-3 text-gray-300"
          />

          {search && (
            <div className="mt-4 space-y-2 max-h-80 overflow-auto">
              {filteredMedicines.map(
                (
                  medicine
                ) => (
                  <div
                    key={
                      medicine.id
                    }
                    onClick={() =>
                      addToCart(
                        medicine
                      )
                    }
                    className="bg-[#0b1220] border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/5 transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-medium">
                          {
                            medicine.name
                          }
                        </h3>

                        <p className="text-sm text-gray-400">
                          {
                            medicine.barcode
                          }
                        </p>
                      </div>

                      <p className="text-green-400 font-semibold">
                        ج.م{" "}
                        {
                          medicine.sellingPrice
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pos;