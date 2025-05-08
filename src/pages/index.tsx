import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientsTable';

type Client = {
  id: string;
  name: string;
  birthday: string;
  type: string;
  account: string;
  balance: number;
};

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('clients').select('*').order('name');
      if (error) {
        console.error('Error fetching clients:', error.message);
      } else {
        console.log('Fetched clients:', data);
        setClients(data as Client[]);
      }
      setLoading(false);
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesName = client.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === 'All' || client.type === type;
    return matchesName && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <SearchBar search={search} setSearch={setSearch} type={type} setType={setType} />
        {loading ? (
          <p className="text-center text-gray-600 mt-6">Loading clients...</p>
        ) : (
          <ClientTable clients={filteredClients} />
        )}
      </div>
    </div>
  );
}
