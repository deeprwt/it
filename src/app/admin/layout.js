import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { ADMIN_THEME_KEY } from "@/components/admin/theme-constants";

export const metadata = {
  title: { default: "Dashboard", template: "%s · Snowdox Admin" },
  robots: { index: false, follow: false },
};

// Applies the stored light/dark choice before first paint (no flash).
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  ADMIN_THEME_KEY
)});document.documentElement.dataset.theme=t==="light"||t==="dark"?t:"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function AdminRootLayout({ children }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <AdminThemeProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </AdminThemeProvider>
    </>
  );
}
