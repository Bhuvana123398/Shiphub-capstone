interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchBox({
  query,
  onQueryChange,
}: SearchBoxProps) {
  return (
    <input
      type="text"
      placeholder="Search by customer name..."
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}