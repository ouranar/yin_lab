import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/auth";
import { readSiteData, syncNewsArchive } from "@/lib/site-data";

export default async function AdminPage() {
  await requireAdmin();
  const archiveResult = await syncNewsArchive();
  const data = await readSiteData({ skipNoStore: true });

  return (
    <AdminDashboard
      archiveMessage={
        archiveResult.archivedItems.length
          ? `进入后台时已自动归档 ${archiveResult.archivedItems.length} 条新闻。`
          : undefined
      }
      initialData={data}
    />
  );
}
