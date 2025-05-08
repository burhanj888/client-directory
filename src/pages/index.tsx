import { useState, useEffect } from 'react';
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
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [birthdayFilter, setBirthdayFilter] = useState('');

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) console.error(error);
    else {
      setClients(data);
      setFilteredClients(data); // default load
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = () => {
    const result = clients.filter((client) => {
      const matchesName =
        !nameFilter || client.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesType = typeFilter === 'All' || client.type === typeFilter;
      const matchesBirthday = !birthdayFilter || client.birthday === birthdayFilter;
      return matchesName && matchesType && matchesBirthday;
    });

    setFilteredClients(result);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <SearchBar
          search={nameFilter}
          setSearch={setNameFilter}
          type={typeFilter}
          setType={setTypeFilter}
          birthday={birthdayFilter}
          setBirthday={setBirthdayFilter}
          onSearch={handleSearch}
        />
        <ClientTable clients={filteredClients} />
      </div>
    </div>
  );
}
