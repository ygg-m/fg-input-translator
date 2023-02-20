import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <span>Oops, didn't find the page you wanted.</span>
      <span>
        <Link
          className="hover:shadow-cyan box-content flex justify-center rounded-lg border border-neutral-700 py-1 px-4 text-base text-neutral-400 duration-200 hover:border-cyan-500 hover:px-6 hover:text-cyan-500"
          to="/"
        >
          Get me out of here!
        </Link>{" "}
      </span>
    </div>
  );
};
