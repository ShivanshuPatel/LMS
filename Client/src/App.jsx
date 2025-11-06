import "./App.css";
import Login from "./Pages/Login";
import Navbar from "./components/Navbar";
import HeroSection from "./Pages/Student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Courses from "./Pages/Student/Courses";
import MyLearning from "./Pages/Student/MyLearning";
import Profile from "./Pages/Student/Profile";
import Sidebar from "./Pages/admin/Sidebar";
import Dashboard from "./Pages/admin/Dashboard";
import CourseTable from "./Pages/admin/Course/CourseTable";
import AddCourse from "./Pages/admin/Course/AddCourse";
import EditCourse from "./Pages/admin/Course/EditCourse";
import CreateLecture from "./Pages/admin/Lecture/CreateLecture";
import EditLecture from "./Pages/admin/Lecture/EditLecture";
import CourseDetail from "./Pages/Student/CourseDetail";
import CourseProgress from "./Pages/Student/CourseProgress";
import SearchPage from "./Pages/Student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectRoute,
} from "./components/protectedRoutes";
import PurchaseCourseProtectedRoute from "./components/purchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectRoute>
            <MyLearning />
          </ProtectRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectRoute>
            <Profile />
          </ProtectRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectRoute>
            <SearchPage />
          </ProtectRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectRoute>
            <CourseDetail />
          </ProtectRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectRoute>
        ),
      },

      // admin routes start from here
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
