import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "./Layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import Pos from "./pages/Pos";
import Search from "./pages/Search";
import Reports from "./pages/Reports";
import Notification from "./pages/Notification";
import Users from "./pages/Users";
import DailyTransactions from "./pages/DailyTransactions";
import Login from "./pages/Login";

function ProtectedRoute({
  children,
}) {
  const [loading, setLoading] =
    useState(true);

  const [isAuth, setIsAuth] =
    useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        // no token
        if (
          !token ||
          token ===
            "undefined" ||
          token === "null"
        ) {
          localStorage.clear();

          setIsAuth(false);
          setLoading(false);

          return;
        }

        // validate token
        const response =
          await fetch(
            "https://backendfinal-1-production.up.railway.app/api/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        // invalid token
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

          setIsAuth(false);
        } else {
          setIsAuth(true);
        }
      } catch (error) {
        console.log(error);

        localStorage.clear();

        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        جاري التحقق...
      </div>
    );
  }

  return isAuth ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* PROTECTED */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>

                    <Route
                      path="/"
                      element={
                        <Dashboard />
                      }
                    />

                    <Route
                      path="/inventory"
                      element={
                        <Inventory />
                      }
                    />

                    <Route
                      path="/sales"
                      element={
                        <Sales />
                      }
                    />

                    <Route
                      path="/suppliers"
                      element={
                        <Suppliers />
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <Settings />
                      }
                    />

                    <Route
                      path="/pos"
                      element={
                        <Pos />
                      }
                    />

                    <Route
                      path="/search"
                      element={
                        <Search />
                      }
                    />

                    <Route
                      path="/reports"
                      element={
                        <Reports />
                      }
                    />

                    <Route
                      path="/notification"
                      element={
                        <Notification />
                      }
                    />

                    <Route
                      path="/users"
                      element={
                        <Users />
                      }
                    />

                    <Route
                      path="/daily-transactions"
                      element={
                        <DailyTransactions />
                      }
                    />

                    {/* fallback */}
                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/"
                          replace
                        />
                      }
                    />

                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;