import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import theme from "./theme";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import MyBooks from "./pages/MyBooks";
import ManageBooks from "./pages/ManageBooks";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={token ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<Books />} />
            <Route path="my-books" element={<MyBooks />} />
            <Route
              path="manage-books"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageBooks />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
};

export default App;
