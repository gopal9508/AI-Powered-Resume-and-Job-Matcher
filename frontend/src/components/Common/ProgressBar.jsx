const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="bg-blue-600 h-2 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
