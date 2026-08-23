import { useEffect } from "react";
import Router from "./router/Router";
import { useAuthStore } from "./stores/authStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "./stores/themeStore";
import Toast from "./components/ui/Toast";

function AuthBootstrap() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return <Router />;
}

function ThemeBootstrap() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeBootstrap />
      <AuthBootstrap />
      <Toast />
    </QueryClientProvider>
  );
};

export default App;
