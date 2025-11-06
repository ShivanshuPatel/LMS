import { Navigate, useParams } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "../features/api/purchaseApi";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailWithStatusQuery();

  if (isLoading) return <p>Loading...</p>;
  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};

export default PurchaseCourseProtectedRoute;
