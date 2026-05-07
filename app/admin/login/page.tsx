import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  if (!isAdminConfigured() && process.env.NODE_ENV === "production") {
    return (
      <div className="admin-login">
        <div className="admin-login__panel">
          <p className="section-heading__eyebrow">Admin Login</p>
          <h1>后台尚未配置</h1>
          <p>请先在服务器环境变量中设置 `LAB_ADMIN_PASSWORD` 和 `LAB_SESSION_SECRET`。</p>
        </div>
      </div>
    );
  }

  return <AdminLoginForm />;
}
