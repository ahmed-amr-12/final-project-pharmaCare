import {
  Shield,
  Upload,
  Download,
  RotateCcw,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import axios from "axios";

function Settings() {
  const { dark, setDark } = useTheme();

  const API_URL =
    "https://backendfinal-1-production.up.railway.app/api";

  // =========================
  // TOGGLE THEME
  // =========================
  const toggleTheme = () => {
    const isDark =
      document.documentElement.classList.contains(
        "dark"
      );

    if (isDark) {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    } else {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    setDark(!dark);
  };

  // =========================
  // DOWNLOAD BACKUP
  // =========================
 const downloadBackup = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/backup`,
        {
          responseType:
            "blob",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.setAttribute(
      "download",
      `backup-${Date.now()}.sql`
    );

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    alert(
      "✅ تم تحميل النسخة الاحتياطية"
    );
  } catch (error) {
    console.log(
      "BACKUP ERROR:",
      error
    );

    alert(
      "❌ فشل تحميل النسخة الاحتياطية"
    );
  }
};

  // =========================
  // RESTORE BACKUP
  // =========================
  const restoreBackup =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      // مهم جداً
      formData.append(
        "backup",
        file
      );

      try {
        await axios.post(
          `${API_URL}/restore`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "✅ تم استعادة قاعدة البيانات بنجاح"
        );

        window.location.reload();
      } catch (error) {
        console.log(error);

        alert(
          "❌ فشل استعادة النسخة الاحتياطية"
        );
      }
    };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="text-right">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          الإعدادات
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          تفضيلات النظام،
          النسخ الاحتياطي،
          والأمان
        </p>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-2xl p-6 flex justify-between items-center">

        <div className="text-right space-y-1">
          <h2 className="text-black dark:text-white font-bold">
            المظهر
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            التبديل بين
            الوضع الليلي
            والنهاري
          </p>
        </div>

        <button
          onClick={
            toggleTheme
          }
          className="bg-gray-100 dark:bg-[#020617] border border-black/10 dark:border-white/10 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          {dark
            ? "الوضع النهاري"
            : "الوضع الليلي"}
        </button>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-2xl p-6 flex justify-between items-center">

        <div className="text-right space-y-2">
          <h2 className="text-black dark:text-white font-bold flex items-center gap-2 justify-end">
            <Shield size={16} />
            أمان المدير
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            تم تعيين
            الرمز (PIN)
          </p>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>
              admin@pharmacy.com
            </p>

            <p>
              +201000000000
            </p>
          </div>
        </div>

        <button className="bg-gray-100 dark:bg-[#020617] border border-black/10 dark:border-white/10 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition">
          إعادة تعيين
          الرمز
        </button>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-4">

        <h2 className="text-black dark:text-white font-bold text-right">
          النسخ الاحتياطي
          والاستعادة
        </h2>

        <div className="flex gap-3 flex-wrap justify-end">

          {/* RESET */}
          <button className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition text-white">
            <RotateCcw size={16} />
            إعادة ضبط النظام
            (حذف الكل)
          </button>

          {/* RESTORE */}
          <label className="cursor-pointer bg-gray-100 dark:bg-[#020617] border border-black/10 dark:border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition">

            <Upload size={16} />

            استعادة من ملف

            <input
              type="file"
              accept=".sql"
              className="hidden"
              onChange={
                restoreBackup
              }
            />
          </label>

          {/* DOWNLOAD */}
          <button
            onClick={
              downloadBackup
            }
            className="bg-gray-100 dark:bg-[#020617] border border-black/10 dark:border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition"
          >
            <Download size={16} />
            تحميل نسخة
            احتياطية
          </button>

        </div>
      </div>
    </div>
  );
}

export default Settings;