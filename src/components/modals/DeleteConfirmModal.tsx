import { Client } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import ModalWrapper from './ModalWrapper';

export default function DeleteConfirmModal({
  client,
  onClose,
  onSuccess,
}: {
  client: Client;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const handleDelete = async () => {
    const { error } = await supabase.from('clients').delete().eq('id', client.id);

    if (error) {
      toast.error('Failed to delete account.');
    } else {
      toast.success('Account deleted successfully.');
      onSuccess(); // ✅ refresh the client list
      onClose();
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-[#650000] mb-4">Delete Account</h2>
      <p className="text-sm text-gray-700 mb-6">
        Are you sure you want to permanently close the account for{' '}
        <span className="font-semibold">{client.name}</span> ({client.account})?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:text-[#650000]"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm rounded-lg bg-[#650000] text-white hover:bg-red-800"
        >
          Confirm Delete
        </button>
      </div>
    </ModalWrapper>
  );
}
