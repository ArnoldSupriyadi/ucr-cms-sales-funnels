import { redirect } from 'next/navigation'
export default async function EditBookingRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/orders/${id}/edit`)
}
