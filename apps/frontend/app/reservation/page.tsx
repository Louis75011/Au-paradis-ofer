import BookingWidget from "@/components/BookingWidget";

export default function ReservationPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Réserver une séance</h1>
      <p className="opacity-80">
        Choisissez un créneau, puis payez par carte (immédiat) ou par SEPA si la date est
        suffisamment lointaine.
      </p>
      <div className="mt-6">
        <BookingWidget offer="seance" />
      </div>
    </main>
  );
}
