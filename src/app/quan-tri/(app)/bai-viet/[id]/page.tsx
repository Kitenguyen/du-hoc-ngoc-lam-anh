import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { can } from "@/lib/admin/perms";
import { canEditPost, getPost } from "@/lib/admin/posts";
import { requireUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Sửa bài viết" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("blogWrite");
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) notFound();
  if (!canEditPost(user, post)) redirect("/quan-tri/bai-viet");
  return (
    <PostEditor
      canPublish={can(user, "blogPublish")}
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        cover: post.cover ?? "",
        labels: post.labels,
        status: post.status,
        reviewNote: post.review_note,
        author: post.author_name ?? "",
      }}
    />
  );
}
