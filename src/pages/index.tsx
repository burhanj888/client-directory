import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import ClientTable from '../components/ClientsTable';
import dynamic from 'next/dynamic';

const AddClientModal = dynamic(() => import('../components/modals/AddClientModal'));
const ViewClientModal = dynamic(() => import('../components/modals/ViewClientModal'));
const TransferModal = dynamic(() => import('../components/modals/TransferModal'));
const DeleteConfirmModal = dynamic(() => import('../components/modals/DeleteConfirmModal'));


import { Client } from '../types';

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [birthdayFilter, setBirthdayFilter] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [modalType, setModalType] = useState<'add' | 'view' | 'transfer' | 'delete' | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [gotoPage, setGotoPage] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchClients = async (
    name = nameFilter,
    type = typeFilter,
    birthday = birthdayFilter,
    pageNumber = page
  ) => {
    setIsLoading(true); // start loading
  
    let query = supabase.from('clients').select('*', { count: 'exact' });
  
    if (name) query = query.ilike('name', `%${name}%`);
    if (birthday) query = query.eq('birthday', birthday);
    if (type !== 'All') query = query.eq('type', type);
  
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;
  
    const { data, count, error } = await query.range(from, to);
  
    setIsLoading(false); // done loading
  
    if (error) {
      console.error('Error fetching clients:', error.message);
    } else {
      setClients(data as Client[]);
      setTotalCount(count || 0);
    }
  };
  

  useEffect(() => {
    fetchClients();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchClients(nameFilter, typeFilter, birthdayFilter, 1);
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
          clients={clients}
          isLoading={isLoading}
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 text-sm">
          <p className='text-gray-500'>
            Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–
            {Math.min(page * pageSize, totalCount)} of {totalCount} clients
            <span className="ml-2 text-gray-500"> (Page {page} of {totalPages || 1})</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-[#650000] rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-[#650000] rounded disabled:opacity-50"
            >
              Next
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const num = parseInt(gotoPage);
                if (!isNaN(num) && num >= 1 && num <= totalPages) {
                  setPage(num);
                }
                setGotoPage('');
              }}
            >
              <input
                type="number"
                placeholder="Go to"
                value={gotoPage}
                onChange={(e) => setGotoPage(e.target.value)}
                className="w-24 px-2 py-1 border text-gray-500 border-gray-500 rounded text-sm hover:border-[#650000] focus:outline-none focus:ring-1 focus:ring-[#650000]"
                min={1}
                max={totalPages}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalType === 'add' && (
        <AddClientModal onClose={() => setModalType(null)} onSuccess={() => fetchClients()} />
      )}
      {modalType === 'view' && selectedClient && (
        <ViewClientModal client={selectedClient} onClose={() => setModalType(null)} />
      )}
      {modalType === 'transfer' && selectedClient && (
        <TransferModal client={selectedClient} onClose={() => setModalType(null)} onSuccess={() => fetchClients()} />
      )}
      {modalType === 'delete' && selectedClient && (
        <DeleteConfirmModal client={selectedClient} onClose={() => setModalType(null)} onSuccess={() => fetchClients()} />
      )}
    </div>
  );
}
