import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import ModalWrapper from './ModalWrapper';
import FloatingLabelInput from '../FloatingLabelInput';
import toast from 'react-hot-toast';

export default function AddClientModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [type, setType] = useState('Checking');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const minBalance = type === 'Checking' ? 500 : 100;

  const generateAccountNumber = () => {
    return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
  };

  const validate = useCallback(() => {
    if (!name.trim()) return 'Name is required.';
    if (!/^[A-Za-z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces.';
    if (!birthday) return 'Birthday is required.';
    const birthDate = new Date(birthday);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassedThisYear =
      new Date().getMonth() > birthDate.getMonth() ||
      (new Date().getMonth() === birthDate.getMonth() && new Date().getDate() >= birthDate.getDate());
    const fullAge = hasBirthdayPassedThisYear ? age : age - 1;
    if (fullAge < 16) return 'Client must be at least 16 years old.';
    if (!balance || isNaN(Number(balance))) return 'Balance must be a valid number.';
    if (Number(balance) < minBalance) return `Minimum balance for a ${type} account is $${minBalance}`;
    return '';
  }, [name, birthday, balance, minBalance, type]);
  

  useEffect(() => {
    setError(validate());
  }, [validate]);

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const account = generateAccountNumber();
    setLoading(true);

    const { error: insertError } = await supabase.from('clients').insert([
      {
        name,
        birthday,
        type,
        balance: Number(balance),
        account,
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error(insertError.message);
      toast.error('Failed to create client.');
    } else {
      toast.success('Client created successfully!');
      onSuccess(); // ✅ refresh client list
      onClose();
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-red-900 mb-4">Add Client</h2>

      <div className="space-y-4">
        <FloatingLabelInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FloatingLabelInput
          label="Birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <div className="relative w-full group">
          <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-red-900 z-10">Account Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-2 border-red-900 rounded-xl px-4 py-[0.65rem] bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-900"
          >
            <option value="Checking">Checking</option>
            <option value="Savings">Savings</option>
          </select>
        </div>

        <FloatingLabelInput
          label="Initial Balance"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-900 text-white px-5 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
