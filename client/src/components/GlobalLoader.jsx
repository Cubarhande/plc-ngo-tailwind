import { useLoading } from "../context/LoadingContext";

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-7 shadow-2xl dark:bg-slate-900">
        
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Loading...
        </p>

      </div>
    </div>
  );
};

export default GlobalLoader;