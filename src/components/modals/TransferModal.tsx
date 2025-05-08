import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import ModalWrapper from './ModalWrapper';
import FloatingLabelInput from '../FloatingLabelInput';
import { Client } from '../../types';
import toast from 'react-hot-toast';

export default function TransferModal({
  client,
  onClose,
  onSuccess
}: {
  client: Client;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [account1, setAccount1] = useState('');
  const [account2, setAccount2] = useState('');
  const [receiver, setReceiver] = useState<Client | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Fetch receiver info when accounts match
  useEffect(() => {
    const validateAccount = async () => {
      setReceiver(null);
      if (account1.length === 13 && account1 === account2) {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('account', account1)
          .single();

        if (data && data.id !== client.id) {
          setReceiver(data);
        } else {
          setReceiver(null);
        }
      }
    };

    validateAccount();
  }, [account1, account2, client.id]);

  const validate = () => {
    if (!account1 || !account2) return 'Please enter and confirm recipient account number.';
    if (account1 !== account2) return 'Account numbers do not match.';
    if (!receiver) return 'Receiver account not found.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return 'Invalid amount.';
    if (Number(amount) > client.balance) return 'Insufficient balance.';
    return '';
  };

  const handleTransfer = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    const transferAmount = Number(amount);
    const senderNewBalance = client.balance - transferAmount;
    const receiverNewBalance = (receiver?.balance || 0) + transferAmount;

    const { error: senderError } = await supabase
      .from('clients')
      .update({ balance: senderNewBalance })
      .eq('id', client.id);

    const { error: receiverError } = await supabase
      .from('clients')
      .update({ balance: receiverNewBalance })
      .eq('id', receiver?.id);

    setLoading(false);

    if (senderError || receiverError) {
      toast.error('Transfer failed. Please try again.');
    } else {
      toast.success('Transfer successful!');
      onSuccess();
      onClose();
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-red-900 mb-4">Transfer Funds</h2>
      <div className="space-y-4">
        <FloatingLabelInput
          label="Recipient Account Number"
          value={account1}
          onChange={(e) => setAccount1(e.target.value)}
        />
        <FloatingLabelInput
          label="Confirm Account Number"
          value={account2}
          onChange={(e) => setAccount2(e.target.value)}
        />

        {account1 && account2 && (
          <p className="text-sm text-gray-700">
            {account1 === account2
              ? receiver
                ? `Receiver: ${receiver.name}`
                : 'No matching account found.'
              : 'Account numbers do not match.'}
          </p>
        )}

        <FloatingLabelInput
          label="Amount to Transfer"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {validationError && (
          <p className="text-sm text-red-600">{validationError}</p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTransfer}
            disabled={loading}
            className="bg-red-900 text-white px-5 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? 'Transferring...' : 'Make Transfer'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
