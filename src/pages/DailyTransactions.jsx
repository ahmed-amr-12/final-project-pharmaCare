import { useEffect, useState } from "react";
import {
  Shield,
  FileText,
  Printer,
  Fingerprint,
  LogOut,
} from "lucide-react";

import {
  getAuditLogs,
  checkIn,
  checkOut,
} from "../services/api";

function DailyTransactions() {
  const [logs, setLogs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  const username =
    user.username;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs =
    async () => {
      try {
        setLoading(true);

        const response =
          await getAuditLogs();

        console.log(
          "LOGS:",
          response
        );

        const salesLogs =
          response?.data?.filter(
            (log) =>
              log.action?.includes(
                "SALE"
              ) ||
              log.action?.includes(
                "CREATE_SALE"
              ) ||
              log.action?.includes(
                "SALE_WITH_INTERACTION"
              )
          ) || [];

        setLogs(
          salesLogs
        );
      } catch (error) {
        console.error(
          "ERROR FETCHING LOGS:",
          error
        );

        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

  // ======================
  // CHECK IN
  // ======================
  const handleCheckIn =
    async () => {
      try {
        const response =
          await checkIn(
            username
          );

        if (
          response.error
        ) {
          alert(
            response.error
          );
          return;
        }

        alert(
          response.message ||
            "تم تسجيل الحضور ✅"
        );
      } catch (
        error
      ) {
        console.log(
          error
        );

        alert(
          "فشل تسجيل الحضور ❌"
        );
      }
    };

  // ======================
  // CHECK OUT
  // ======================
  const handleCheckOut =
    async () => {
      try {
        const response =
          await checkOut(
            username
          );

        if (
          response.error
        ) {
          alert(
            response.error
          );
          return;
        }

        alert(
          response.message ||
            "تم تسجيل الانصراف ✅"
        );
      } catch (
        error
      ) {
        console.log(
          error
        );

        alert(
          "فشل تسجيل الانصراف ❌"
        );
      }
    };

  // ======================
  // FILTER
  // ======================
  const filteredLogs =
    logs.filter(
      (log) => {
        const q =
          search.toLowerCase();

        return (
          log.actorName
            ?.toLowerCase()
            .includes(
              q
            ) ||
          log.action
            ?.toLowerCase()
            .includes(
              q
            ) ||
          log.details
            ?.toLowerCase()
            .includes(
              q
            )
        );
      }
    );

  // ======================
  // TOTAL REVENUE
  // ======================
  const totalRevenue =
    filteredLogs.reduce(
      (
        sum,
        log
      ) => {
        const match =
          log.details?.match(
            /\d+(\.\d+)?/
          );

        return (
          sum +
          (match
            ? Number(
                match[0]
              )
            : 0)
        );
      },
      0
    );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="text-right space-y-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 justify-end">
          <Shield size={20} />
          مركز الإدارة والمراقبة
        </h1>

        <p className="text-gray-400 text-sm">
          تتبع نشاط
          الموظفين
          والمبيعات
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">

        <div className="flex gap-3">

          <button
            onClick={
              handleCheckIn
            }
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white"
          >
            <Fingerprint
              size={
                18
              }
            />
            تسجيل حضور
          </button>

          <button
            onClick={
              handleCheckOut
            }
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white"
          >
            <LogOut
              size={
                18
              }
            />
            إنهاء الشيفت
          </button>

        </div>

        <span className="text-white border-b-2 border-white pb-1">
          المبيعات اليومية
        </span>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="...بحث باسم الموظف أو الحدث"
        value={search}
        onChange={(
          e
        ) =>
          setSearch(
            e.target
              .value
          )
        }
        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
      />

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 text-right">
          <p className="text-gray-400 text-sm">
            إجمالي
            الإيرادات
          </p>

          <h2 className="text-2xl font-bold text-white mt-2">
            {totalRevenue.toFixed(
              2
            )}{" "}
            ج.م
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 text-right">
          <p className="text-gray-400 text-sm">
            عدد
            العمليات
          </p>

          <h2 className="text-2xl font-bold text-white mt-2">
            {
              filteredLogs.length
            }
          </h2>
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-400">
          جاري تحميل
          البيانات...
        </div>
      )}

      {/* LOGS */}
      <div className="space-y-3">

        {!loading &&
          filteredLogs.length ===
            0 && (
            <div className="text-center text-gray-500 py-10">
              لا يوجد
              معاملات
            </div>
          )}

        {filteredLogs.map(
          (log) => (
            <div
              key={
                log.id
              }
              className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:bg-white/5 transition"
            >

              {/* RIGHT */}
              <div className="text-right space-y-1">

                <p className="text-white font-semibold">
                  {
                    log.action
                  }
                </p>

                <p className="text-gray-400 text-sm">
                  {
                    log.actorName
                  }
                </p>

                <p className="text-gray-500 text-xs">
                  {new Date(
                    log.ts
                  ).toLocaleString(
                    "ar-EG"
                  )}
                </p>

              </div>

              {/* LEFT */}
              <div className="flex gap-2">

                {/* DETAILS */}
           <button
  onClick={() => {
    try {
      console.log(
        "FULL LOG:",
        log
      );

      let medicines =
        [];

      // نحاول نقرأ الأدوية من details
      if (
        typeof log.details ===
        "string"
      ) {
        try {
          const jsonMatch =
            log.details.match(
              /\[.*\]/s
            );

          if (
            jsonMatch
          ) {
            medicines =
              JSON.parse(
                jsonMatch[0]
              );
          }
        } catch (
          err
        ) {
          console.log(
            err
          );
        }
      }

      const medicinesText =
        medicines
          .length > 0
          ? medicines
              .map(
                (
                  med,
                  index
                ) => {
                  const name =
                    med.name ||
                    med.medicineName ||
                    med.medicine?.name ||
                    med.title ||
                    "دواء";

                  const qty =
                    med.qty ||
                    med.quantity ||
                    1;

                  const price =
                    med.price ||
                    med.sellingPrice ||
                    med.total ||
                    0;

                  return `
${index + 1}- ${name}

الكمية: ${qty}

السعر: ${price} ج.م
`;
                }
              )
              .join(
                "\n-----------------\n"
              )
          : "لا توجد تفاصيل أدوية";

      alert(`
🧾 تفاصيل العملية

نوع العملية:
${log.action}

الموظف:
${log.actorName}

💊 الأدوية:
${medicinesText}

📝 التفاصيل:
${log.details}

🕒 الوقت:
${new Date(
  log.ts
).toLocaleString(
  "ar-EG"
)}
      `);
    } catch (
      error
    ) {
      console.log(
        error
      );

      alert(
        "فشل تحميل التفاصيل"
      );
    }
  }}
  className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
>
  <FileText
    size={16}
  />
</button>

                {/* PRINT */}
                <button
                  onClick={() =>
                    window.print()
                  }
                  className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
                >
                  <Printer
                    size={
                      16
                    }
                  />
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default DailyTransactions;