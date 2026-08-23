import type { MainLayoutProps } from "../../types/global";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-dvh overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="flex h-full min-w-0 flex-col lg:pl-64">
        <Header />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
