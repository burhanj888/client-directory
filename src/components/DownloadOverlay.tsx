import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function DownloadOverlay({ status }: { status: string }) {
  const isComplete = status.includes('complete');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30">
      <div className="w-60 h-60 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center px-4 py-6">
        {isComplete ? (
          <CheckCircleIcon className="h-16 w-16 text-green-600 animate-bounce mb-3" />
        ) : (
          <div className="w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full animate-spin mb-3" />
        )}
        <p className="text-red-900 font-semibold text-lg">
          {status}
        </p>
      </div>
    </div>
  );
}
