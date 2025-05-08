import { Client } from '../types';

type Props = {
    clients: Client[];
    onView: (client: Client) => void;
    onTransfer: (client: Client) => void;
    onDelete: (client: Client) => void;
  };
  
  export default function ClientTable({ clients, onView, onTransfer, onDelete }: Props) {

    
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
            {clients.map((client, idx) => (
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
                <td className="p-3 font-bold text-gray-700">
                  ${client.balance.toLocaleString()}
                </td>
                <td className="p-3 text-center text-red-900">
                <button onClick={() => onView(client)} className="hover:underline">Details</button> <span className='hidden sm:inline'> | </span>
                <button onClick={() => onTransfer(client)} className="hover:underline">Transfer</button> <span className='hidden sm:inline'> | </span>
                <button onClick={() => onDelete(client)} className="hover:underline">Close Account</button>

                  {/* <button className="hover:underline"> Details </button><span> | </span>  
                  <button className="hover:underline"> Transfer </button><span> | </span>
                  <button className="hover:underline"> Close Account </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  