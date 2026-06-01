import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getTodayReport,
  getHistoricalReport,
} from "../services/api";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function Reports() {
  const [todayReport, setTodayReport] =
    useState({});

  const [historical, setHistorical] =
    useState([]);

  const [range, setRange] =
    useState("day");

  // =====================
  // TODAY REPORT
  // =====================
  useEffect(() => {
    const fetchToday =
      async () => {
        try {
          const data =
            await getTodayReport();

          console.log(
            "TODAY REPORT:",
            data
          );

          setTodayReport(
            data || {}
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchToday();
  }, []);

  // =====================
  // HISTORICAL REPORT
  // =====================
  useEffect(() => {
    const fetchHistorical =
      async () => {
        try {
          const data =
            await getHistoricalReport(
              range
            );

          console.log(
            "HISTORICAL REPORT:",
            data
          );

          const history =
            Array.isArray(
              data?.history
            )
              ? data.history
              : [];

          setHistorical(
            history
          );
        } catch (error) {
          console.log(error);
          setHistorical([]);
        }
      };

    fetchHistorical();
  }, [range]);

  // =====================
  // SAFE TOTALS
  // =====================
  const totalSales =
    historical.reduce(
      (sum, item) =>
        sum +
        Number(
          item.total ??
            item.sales ??
            item.amount ??
            item.grandTotal ??
            0
        ),
      0
    );

  const totalProfit =
    historical.reduce(
      (sum, item) =>
        sum +
        Number(
          item.profit ??
            item.netProfit ??
            0
        ),
      0
    );

  const totalOperations =
    historical.reduce(
      (sum, item) =>
        sum +
        Number(
          item.salesCount ??
            item.count ??
            item.operations ??
            item.orders ??
            1
        ),
      0
    );

// =====================
// EXPORT PDF
// =====================
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Pharmacy Reports", 14, 20);

  doc.setFontSize(12);
  doc.text(
    `Range: ${range}`,
    14,
    30
  );

  doc.text(
    `Total Sales: ${totalSales.toFixed(
      2
    )} EGP`,
    14,
    40
  );

  doc.text(
    `Profit: ${totalProfit.toFixed(
      2
    )} EGP`,
    14,
    50
  );

  doc.text(
    `Operations: ${totalOperations}`,
    14,
    60
  );

  autoTable(doc, {
    startY: 70,
    head: [
      [
        "Date",
        "Sales",
        "Profit",
        "Operations",
      ],
    ],
    body: historical.map(
      (item) => [
        item.date ||
          item.day ||
          "-",

        Number(
          item.total ??
            item.sales ??
            item.amount ??
            item.grandTotal ??
            0
        ).toFixed(2),

        Number(
          item.profit ??
            0
        ).toFixed(2),

        Number(
          item.salesCount ??
            item.count ??
            1
        ),
      ]
    ),
  });

  doc.save(
    `report-${range}.pdf`
  );
};

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          التقارير والإحصائيات
        </h1>

        <p className="text-gray-400 text-sm">
          تتبع المبيعات،
          تحليل الأرباح،
          وتقفيل اليومية
        </p>
      </div>

      {/* TODAY */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">
            {todayReport?.salesCount ||
              0}{" "}
            عملية بيع
          </span>

          <h2 className="text-white font-bold">
            مبيعات اليوم الحالية
          </h2>
        </div>

        {/* BOXES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Box
            title="كاش"
            value={
              todayReport
                ?.totals?.cash
            }
          />

          <Box
            title="فيزا"
            value={
              todayReport
                ?.totals?.card
            }
          />

          <Box
            title="محفظة"
            value={
              todayReport
                ?.totals?.wallet
            }
          />

          <Box
            title="تأمين"
            value={
              todayReport
                ?.totals
                ?.insurance
            }
          />
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center border-t border-white/10 pt-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg opacity-60">
            تقفيل اليومية
            (مطلوب رمز)
          </button>

          <div className="text-right">
            <p className="text-gray-400 text-sm">
              إجمالي مبيعات
              اليوم
            </p>

            <h2 className="text-white text-2xl font-bold">
              ج.م{" "}
              {Number(
                todayReport?.grandTotal ||
                  0
              ).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* HISTORICAL */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-5">

        {/* TOP */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[
              "day",
              "week",
              "month",
            ].map((r) => (
              <button
                key={r}
                onClick={() =>
                  setRange(r)
                }
                className={`px-3 py-1 rounded-lg text-sm ${
                  range === r
                    ? "bg-white text-black"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {r === "day"
                  ? "يومي"
                  : r ===
                    "week"
                  ? "أسبوعي"
                  : "شهري"}
              </button>
            ))}
          </div>

          <h2 className="text-white font-bold">
            التقارير السابقة
          </h2>
        </div>

  {/* EXPORT */}
<div className="flex gap-2">
  <button
    onClick={downloadPDF}
    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-sm"
  >
    PDF
    <Download size={14} />
  </button>

  <button className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-sm">
    CSV
    <Download size={14} />
  </button>
</div>
        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4">
          <SmallBox
            title="إجمالي المبيعات"
            value={`${totalSales.toFixed(
              2
            )} ج.م`}
          />

          <SmallBox
            title="الأرباح"
            value={`${totalProfit.toFixed(
              2
            )} ج.م`}
          />

          <SmallBox
            title="عدد العمليات"
            value={
              totalOperations
            }
          />
        </div>

        {/* TABLE */}
        <div className="bg-[#0b1220] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-3">
                  التاريخ
                </th>

                <th className="p-3">
                  المبيعات
                </th>

                <th className="p-3">
                  الربح
                </th>

                <th className="p-3">
                  عدد العمليات
                </th>
              </tr>
            </thead>

            <tbody>
              {historical.length >
              0 ? (
                historical.map(
                  (
                    item,
                    index
                  ) => {
                    const sales =
                      Number(
                        item.total ??
                          item.sales ??
                          item.amount ??
                          item.grandTotal ??
                          0
                      );

                    const profit =
                      Number(
                        item.profit ??
                          0
                      );

                    const count =
                      Number(
                        item.salesCount ??
                          item.count ??
                          1
                      );

                    return (
                      <tr
                        key={
                          index
                        }
                        className="border-b border-white/10"
                      >
                        <td className="p-3">
                          {item.date ||
                            item.day ||
                            "—"}
                        </td>

                        <td className="p-3">
                          ج.م{" "}
                          {sales.toFixed(
                            2
                          )}
                        </td>

                        <td className="p-3">
                          ج.م{" "}
                          {profit.toFixed(
                            2
                          )}
                        </td>

                        <td className="p-3">
                          {count}
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    لا يوجد
                    بيانات لهذه
                    الفترة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Box({
  title,
  value,
}) {
  return (
    <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-white font-bold">
        ج.م{" "}
        {Number(
          value || 0
        ).toFixed(2)}
      </h2>
    </div>
  );
}

function SmallBox({
  title,
  value,
}) {
  return (
    <div className="bg-[#0b1220] border border-white/10 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-white font-bold">
        {value}
      </h2>
    </div>
  );
}

export default Reports;