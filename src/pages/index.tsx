import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientsTable';
import AddClientModal from '../components/modals/AddClientModal';
import ViewClientModal from '../components/modals/ViewClientModal';
import TransferModal from '../components/modals/TransferModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { Client } from '../types';


export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [birthdayFilter, setBirthdayFilter] = useState('');

  const [modalType, setModalType] = useState<'add' | 'view' | 'transfer' | 'delete' | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Fetch clients from Supabase
  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      console.error('Error fetching clients:', error.message);
    } else {
      setClients(data as Client[]);
      setFilteredClients(data as Client[]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Apply filters when Search is clicked
  const handleSearch = () => {
    const filtered = clients.filter((client) => {
      const matchesName = !nameFilter || client.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesType = typeFilter === 'All' || client.type === typeFilter;
      const matchesBirthday = !birthdayFilter || client.birthday === birthdayFilter;
      return matchesName && matchesType && matchesBirthday;
    });

    setFilteredClients(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <SearchBar
          search={nameFilter}
          setSearch={setNameFilter}
          birthday={birthdayFilter}
          setBirthday={setBirthdayFilter}
          type={typeFilter}
          setType={setTypeFilter}
          onSearch={handleSearch}
          onAddClient={() => setModalType('add')}
        />

        <ClientTable
          clients={filteredClients}
          onView={(client) => {
            setSelectedClient(client);
            setModalType('view');
          }}
          onTransfer={(client) => {
            setSelectedClient(client);
            setModalType('transfer');
          }}
          onDelete={(client) => {
            setSelectedClient(client);
            setModalType('delete');
          }}
        />
      </div>

      {/* Modals */}
      {modalType === 'add' && (
        <AddClientModal
          onClose={() => setModalType(null)}
          onSuccess={fetchClients} // ✅ refresh on success
        />
      )}
      {modalType === 'view' && selectedClient && (
        <ViewClientModal client={selectedClient} onClose={() => setModalType(null)} />
      )}
      {modalType === 'transfer' && selectedClient && (
        <TransferModal
          client={selectedClient}
          onClose={() => setModalType(null)}
          onSuccess={fetchClients}
        />
      )}

      {modalType === 'delete' && selectedClient && (
        <DeleteConfirmModal
          client={selectedClient}
          onClose={() => setModalType(null)}
          onSuccess={fetchClients}
        />
      )}
    </div>
  );
}
