import ModalWrapper from './ModalWrapper';
import { Client } from '../../types';
import { format } from 'date-fns';

export default function ViewClientModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const formattedBirthday = format(new Date(client.birthday), 'MMMM d, yyyy');
  const formattedCreatedAt = format(new Date(client.created_at), 'MMMM d, yyyy h:mm a');

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-red-900 mb-4">Client Details</h2>
      <div className="space-y-3 text-gray-700 text-sm">
        <p><span className="font-semibold">Name:</span> {client.name}</p>
        <p><span className="font-semibold">Birthday:</span> {formattedBirthday}</p>
        <p><span className="font-semibold">Account Type:</span> {client.type}</p>
        <p><span className="font-semibold">Account Number:</span> {client.account}</p>
        <p><span className="font-semibold">Balance:</span> ${client.balance.toLocaleString()}</p>
        <p><span className="font-semibold">Account Opened:</span> {formattedCreatedAt}</p>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-red-800"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}
