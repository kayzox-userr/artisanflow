"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabaseProvider";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function ClientsPage() {
  const { supabase, session } = useSupabase();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    profession: "",
    company_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  // Charger les clients depuis Supabase
  useEffect(() => {
    if (!session) return;
    fetchClients();
  }, [session]);

  async function fetchClients() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients") // ← TABLE "clients"
      .select("*")
      .eq("org_id", session?.user?.id);

    if (error) {
      console.error("Erreur chargement clients:", error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  }

  // Ajouter ou mettre à jour un client
  async function handleSaveClient() {
    if (!form.name) return alert("Le nom est obligatoire");

    if (editingClient) {
      // ✅ Mise à jour
      const { error } = await supabase
        .from("clients") // ← TABLE "clients"
        .update(form)
        .eq("id", editingClient.id);

      if (error) console.error("Erreur maj client:", error);
    } else {
      // ➕ Ajout
      const { error } = await supabase.from("clients").insert([
        {
          ...form,
          org_id: session?.user?.id || "test-user", // fallback pour debug
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) console.error("Erreur insertion client:", error);
    }

    await fetchClients();
    setShowModal(false);
    setEditingClient(null);
    setForm({
      name: "",
      profession: "",
      company_name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
    });
  }

  // Supprimer un client
  async function handleDeleteClient(id: string) {
    if (confirm("Supprimer ce client ?")) {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) console.error("Erreur suppression client:", error);
      await fetchClients();
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Clients
          </motion.h2>

          {/* Bouton ajouter */}
          <button
            onClick={() => {
              setEditingClient(null);
              setForm({
                name: "",
                profession: "",
                company_name: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                postal_code: "",
                country: "",
              });
              setShowModal(true);
            }}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            + Ajouter un client
          </button>

          {/* Tableau */}
          {loading ? (
            <p>Chargement...</p>
          ) : clients.length === 0 ? (
            <p>Aucun client pour le moment.</p>
          ) : (
            <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Nom</th>
                  <th className="py-3 px-4 text-left">Profession</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Téléphone</th>
                  <th className="py-3 px-4 text-left">Ville</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-4">{client.name}</td>
                    <td className="py-2 px-4">{client.profession}</td>
                    <td className="py-2 px-4">{client.email}</td>
                    <td className="py-2 px-4">{client.phone}</td>
                    <td className="py-2 px-4">{client.city}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setForm(client);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* MODALE */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingClient ? "Modifier le client" : "Nouveau client"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(form).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        value={(form as any)[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveClient}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
