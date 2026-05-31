const BASE_URL =
  "https://backendfinal-1-production.up.railway.app/api";

// ==========================================
// TOKEN
// ==========================================
const getToken = () =>
  localStorage.getItem("token");

// ==========================================
// USERS
// ==========================================

const token =
  localStorage.getItem(
    "token"
  );

// Get Users
export const getUsers =
  async () => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/users`,
          {
            method: "GET",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "USERS:",
        data
      );

      return data || [];
    } catch (error) {
      console.log(
        "GET USERS ERROR:",
        error
      );
      return [];
    }
  };

// Add User
export const addUser =
  async (userData) => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(
              userData
            ),
          }
        );

      const data =
        await response.json();

      console.log(
        "ADD USER:",
        data
      );

      return data;
    } catch (error) {
      console.log(
        "ADD USER ERROR:",
        error
      );
    }
  };

// Delete User
export const deleteUser =
  async (id) => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/users/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "DELETE USER:",
        data
      );

      return data;
    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error
      );
    }
  };

// ==========================================
// MEDICINES
// ==========================================

// Get All Medicines
export const getMedicines =
  async () => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/medicines`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "MEDICINES:",
        data
      );

      // API بترجع data array
      return (
        data.data || []
      );
    } catch (error) {
      console.log(
        "GET MEDICINES ERROR:",
        error
      );

      return [];
    }
  };

// Search Medicine By Barcode
export const searchMedicineByBarcode =
  async (barcode) => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/medicines/search/${barcode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "BARCODE:",
        data
      );

      return data;
    } catch (error) {
      console.log(
        "BARCODE ERROR:",
        error
      );
    }
  };

// ==========================================
// SUPPLIERS
// ==========================================

export const getSuppliers =
  async () => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/suppliers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "SUPPLIERS:",
        data
      );

      return data || [];
    } catch (error) {
      console.log(
        "SUPPLIERS ERROR:",
        error
      );

      return [];
    }
  };

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications =
  async () => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "NOTIFICATIONS:",
        data
      );

      return data || [];
    } catch (error) {
      console.log(
        "NOTIFICATIONS ERROR:",
        error
      );

      return [];
    }
  };



  // =================================================
  export const loginUser =
  async (userData) => {
    try {
      const response =
        await fetch(
          `${BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              userData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "فشل تسجيل الدخول"
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // =================================================
  // ================= REPORTS =================

// Today's Report
export const getTodayReport = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${BASE_URL}/reports/today`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("TODAY REPORT:", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Historical Report
export const getHistoricalReport =
  async (range = "day") => {
    const token =
      localStorage.getItem(
        "token"
      );

    try {
      const response =
        await fetch(
          `${BASE_URL}/reports/historical?range=${range}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "HISTORICAL REPORT:",
        data
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  };


  // ======================
  export const createSale =
  async (saleData) => {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${BASE_URL}/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            saleData
          ),
        }
      );

    return response.json();
  };
  // ==========================================================================================
export const getAuditLogs =
  async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      // لو مفيش توكين
      if (!token) {
        localStorage.clear();

        window.location.href =
          "/login";

        return {
          data: [],
        };
      }

      const response =
        await fetch(
          `${BASE_URL}/logs`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      // token invalid
      if (
        response.status ===
          401 ||
        response.status ===
          403
      ) {
        console.log(
          "TOKEN INVALID"
        );

        localStorage.clear();

        window.location.href =
          "/login";

        return {
          data: [],
        };
      }

      const data =
        await response.json();

      console.log(
        "AUDIT LOGS:",
        data
      );

      return data;
    } catch (error) {
      console.error(
        "GET AUDIT LOGS ERROR:",
        error
      );

      localStorage.clear();

      return {
        data: [],
      };
    }
  };

  // ==========================================================
  // ==========================
// CHECK IN
// ==========================
export const checkIn = async (
  username
) => {
  try {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        "https://backendfinal-1-production.up.railway.app/api/attendance/check-in",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
          }),
        }
      );

    const data =
      await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ==========================
// CHECK OUT
// ==========================
export const checkOut =
  async (username) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "https://backendfinal-1-production.up.railway.app/api/attendance/check-out",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                username,
              }),
          }
        );

      const data =
        await response.json();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };