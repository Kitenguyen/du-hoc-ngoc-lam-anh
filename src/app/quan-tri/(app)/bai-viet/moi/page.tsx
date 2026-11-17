import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/PostEditor";
import { can } from "@/lib/admin/perms";
import { requireUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Viết bài mới" };

export default async function NewPostPage() {
  const user = await requireUser("blogWrite");
  return <PostEditor canPublish={can(user, "blogPublish")} />;
}
