import { useState } from "react";

export default function Home() {
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [products] = useState([
    { id: 1, name: "Bezpečnostní kamera A", description: "Vysoce kvalitní kamera s nočním viděním.", price: "3 499 Kč", image: "/camera-a.jpg" },
    { id: 2, name: "Bezpečnostní kamera B", description: "Širokoúhlá kamera s detekcí pohybu.", price: "2 999 Kč", image: "/camera-b.jpg" },
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Zpráva odeslána!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Instalace kamerového systému</h1>

      <div className="mb-4">
        <p>Zde je krátký popis produktu. Je viditelný ihned na webu.</p>
        {showMore && (
          <p className="mt-2">Toto je skrytá část popisu, která se zobrazí po kliknutí na tlačítko \"Zobrazit více\".</p>
        )}
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Skrýt" : "Zobrazit více"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg text-center">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600 font-bold">{product.price}</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Kontaktovat</button>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-2">Nechte nám zprávu</h2>
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Vaše jméno"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Váš Email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <textarea
            name="message"
            placeholder="Popište svůj požadavek"
            value={formData.message}
            onChange={handleInputChange}
            className="p-2 border rounded h-24"
            required
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Odeslat zprávu
          </button>
        </form>
      </div>
    </div>
  );
}
