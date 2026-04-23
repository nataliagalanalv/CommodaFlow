export const SearchBar: React.FC<{ onSearch: (val: string) => void }> = ({ onSearch }) => {
  return (
    <div className="relative max-w-md w-full">
      <input
        type="text"
        placeholder="Buscar hardware por modelo o specs..."
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="absolute left-3 top-2.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};