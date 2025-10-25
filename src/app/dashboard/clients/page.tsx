"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useSupabase } from "@/lib/supabaseProvider";

type ClientRecord = {
  id: string;
  name: string;
  profession?: string | null;
  company_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type ClientFormValues = {
  name: string;
  profession?: string;
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};

const defaultValues: ClientFormValues = {
  name: "",
  profession: "",
  company_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postal_code: "",
  country: "",
};
const clientFields = Object.keys(defaultValues) as Array<keyof ClientFormValues>;

export default function ClientsPage() {
  const { supabase, session } = useSupabase();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({ defaultValues });

  const fetchClients = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, profession, company_name, phone, email, address, city, postal_code, country")
      .eq("org_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setClients(data as ClientRecord[]);
    setLoading(false);
  }, [session, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClients();
  }, [fetchClients]);

  const openModal = (client?: ClientRecord) => {
    if (client) {
      setEditingClient(client);
      reset({
        name: client.name ?? "",
        profession: client.profession ?? "",
        company_name: client.company_name ?? "",
        phone: client.phone ?? "",
        email: client.email ?? "",
        address: client.address ?? "",
        city: client.city ?? "",
        postal_code: client.postal_code ?? "",
        country: client.country ?? "",
      });
    } else {
      setEditingClient(null);
      reset(defaultValues);
    }
    setShowModal(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!session?.user) return;

    const payload = {
      ...values,
      org_id: session.user.id,
      created_at: new Date().toISOString(),
    };

    if (editingClient) {
      const { error } = await supabase
        .from("clients")
        .update(values)
        .eq("id", editingClient.id);
      if (error) {
        console.error("Erreur maj client", error);
      }
    } else {
      const { error } = await supabase.from("clients").insert([payload]);
      if (error) {
        console.error("Erreur création client", error);
      }
    }

    await fetchClients();
    setShowModal(false);
    setEditingClient(null);
    reset(defaultValues);
  },
  (submitError) => {
    console.error("Validation client", submitError);
  });

  const clientColumns = useMemo(
    () => [
      { key: "name", label: "Nom" },
      { key: "profession", label: "Profession" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Téléphone" },
      { key: "city", label: "Ville" },
    ],
    []
  );

  async function handleDeleteClient(id: string) {
    if (!confirm("Supprimer ce client ?")) return;
    await supabase.from("clients").delete().eq("id", id);
    fetchClients();
  }

  return (
    <AuthGuard>
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

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Base clients</p>
                <p className="text-xl font-semibold">{clients.length} contacts</p>
              </div>
              <button
                onClick={() => openModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                + Ajouter un client
              </button>
            </div>

            {loading ? (
              <p>Chargement...</p>
            ) : clients.length === 0 ? (
              <p className="text-gray-500">Aucun client pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      {clientColumns.map((column) => (
                        <th key={column.key} className="py-3 px-4 text-left">
                          {column.label}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-gray-50 transition">
                        {clientColumns.map((column) => (
                          <td key={column.key} className="py-2 px-4">
                            {(client as Record<string, string | null>)[column.key] || "—"}
                          </td>
                        ))}
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={() => openModal(client)}
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
              </div>
            )}

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {editingClient ? "Modifier le client" : "Nouveau client"}
                  </h3>
                  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientFields.map((key) => (
                      <div key={key} className={key === "name" ? "md:col-span-2" : undefined}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key.replace("_", " ")}
                        </label>
                        <input
                          {...register(key, {
                            required: key === "name" ? "Le nom est obligatoire" : false,
                          })}
                          className={`w-full mt-1 p-2 border rounded focus:border-blue-500 focus:outline-none ${
                            errors[key] ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                        {errors[key] && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors[key]?.message as string}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
