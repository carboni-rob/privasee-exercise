const UnassignedChip: React.FC = () => {
  return (
    <div
      className={`
          inline-flex items-center 
          max-w-full bg-gray-50 
          rounded-full pr-3 pl-1 py-1 
          border border-dashed border-gray-300
        `}
    >
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <span className="ml-2 text-sm font-medium text-gray-500">Unassigned</span>
    </div>
  );
};

export default UnassignedChip;
