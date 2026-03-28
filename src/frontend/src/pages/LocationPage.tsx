export default function LocationPage() {
  const address =
    "Dinki Dine Veg Restaurant, Kadri Park Road, Kadri Hill, Mangalore 575004";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=16`;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 text-center shadow">
        <h1 className="text-xl font-bold tracking-wide">
          🌿 Dinki Dine Veg Restaurant
        </h1>
        <p className="text-sm text-green-100 mt-1">
          Pure Veg | Drive-In Dining
        </p>
      </div>

      {/* Address Card */}
      <div className="mx-4 mt-4 bg-white rounded-xl shadow p-4 border border-orange-100">
        <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span>📍</span> Our Location
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Kadri Park Road, Kadri Hill
          <br />
          Mangalore – 575 004
        </p>
        <div className="mt-3 border-t pt-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span>📞</span> Contact
          </h3>
          <div className="space-y-1">
            <a
              href="tel:+919448241023"
              className="block text-sm text-green-700 font-medium"
            >
              +91 94482 41023
            </a>
            <a href="tel:08242988813" className="block text-sm text-green-700">
              0824-2988813
            </a>
            <a href="tel:08242222213" className="block text-sm text-green-700">
              0824-2222213
            </a>
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        className="mx-4 mt-4 rounded-xl overflow-hidden shadow border border-orange-100 flex-1"
        style={{ minHeight: 320 }}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: 320, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Dinki Dine Location Map"
        />
      </div>

      {/* Open in Maps button */}
      <div className="mx-4 mt-4 mb-6">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-700 hover:bg-green-800 text-white text-center font-semibold py-3 rounded-xl shadow transition"
        >
          🗺️ Open in Google Maps
        </a>
      </div>
    </div>
  );
}
