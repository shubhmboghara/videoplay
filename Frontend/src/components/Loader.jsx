import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-500" />
      <p className="mt-2 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loader;