import { redirect } from "next/navigation";

export default async function NomenclatureAliasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/settings/nomenclatures/${id}`);
}
