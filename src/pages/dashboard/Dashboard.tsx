import { Suspense } from "react";
import DashboardPage from "../../features/dashboard/DashboardPage";

const Dashboard = () => {
  return (
    <Suspense>
      <DashboardPage />
    </Suspense>
  );
};

export default Dashboard;