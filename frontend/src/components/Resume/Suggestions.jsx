const Suggestions = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="my-6">
      <h3 className="font-semibold mb-2">
        How to Improve Your Resume
      </h3>

      <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
        {items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;

