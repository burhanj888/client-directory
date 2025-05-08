import { Client } from '../types';

type Props = {
    clients: Client[];
    onView: (client: Client) => void;
    onTransfer: (client: Client) => void;
    onDelete: (client: Client) => void;
    isLoading: boolean;
  };
  
  export default function ClientTable({ clients, onView, onTransfer, onDelete, isLoading }: Props) {

    
    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="p-3 ps-6">Name</th>
              <th className="p-3">Birthday</th>
              <th className="p-3">Type</th>
              <th className="p-3">Account</th>
              <th className="p-3">Balance</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                [...Array(10)].map((_, idx) => (
                <tr key={idx} className="animate-pulse border-b">
                    <td colSpan={6} className="p-3 ps-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                </tr>
                ))
            ) : clients.length === 0 ? (
                <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                    No clients found.
                </td>
                </tr>
            ) : (
                clients.map((client, idx) => (
                <tr
                    key={client.id}
                    className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    } border-b hover:bg-gray-200`}
                >
                    <td className="p-3 ps-6 text-gray-700">{client.name}</td>
                    <td className="p-3 text-gray-700">{client.birthday}</td>
                    <td className="p-3 text-gray-700">{client.type}</td>
                    <td className="p-3 text-gray-700">{client.account}</td>
                    <td className="p-3 font-bold text-gray-700">${client.balance.toLocaleString()}</td>
                    <td className="p-3 text-center text-red-900">
                    <button onClick={() => onView(client)} className="hover:underline">Details</button>{' '}
                    <span className="hidden sm:inline"> | </span>
                    <button onClick={() => onTransfer(client)} className="hover:underline">Transfer</button>{' '}
                    <span className="hidden sm:inline"> | </span>
                    <button onClick={() => onDelete(client)} className="hover:underline">Close Account</button>
                    </td>
                </tr>
                ))
            )}
            </tbody>

        </table>
      </div>
    );
  }
  