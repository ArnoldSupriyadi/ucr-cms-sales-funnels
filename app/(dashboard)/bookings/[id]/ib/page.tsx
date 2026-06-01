import { redirect } from 'next/navigation'
export default async function IbRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/orders/${id}/ib`)
}
