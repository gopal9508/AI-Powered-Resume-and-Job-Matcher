const MissingKeywords = ({ keywords }) => {
  if (!keywords?.length) return null;

  return (
    <div className="my-6">
      <h3 className="font-semibold mb-1">
        Missing Keywords
      </h3>

      <p className="text-sm text-gray-600 mb-2">
        Add these keywords naturally to improve ATS ranking:
      </p>

      <div className="flex flex-wrap gap-2">
        {keywords.map((k, i) => (
          <span
            key={i}
            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MissingKeywords;

