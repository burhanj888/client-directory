type FloatingInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function FloatingLabelInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
}: FloatingInputProps) {
  return (
    <div className="relative w-full group">
      <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-500 group-hover:text-[#650000] group-hover:font-semibold group-focus:font-semibold group-focus-within:text-[#650000] transition-colors z-10">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-gray-500 border-2 border-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 group-focus:border-2 group-hover:border-2 focus:ring-[#650000] group-hover:border-[#650000] transition-all"
      />
    </div>
  );
}
