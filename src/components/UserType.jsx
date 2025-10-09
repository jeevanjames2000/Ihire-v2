import { Link } from "react-router-dom";
import { User, Briefcase } from "lucide-react";
import IHireboy from "../../src/assets/IHire-boy.jpg";

const UserType = () => {
  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center animate-fade-in">
      {/* Left Section: Existing Content */}
      <div className="w-full md:w-1/2 text-center md:text-left p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[#4A628A] to-[#4A628A] text-transparent bg-clip-text">
            IHire
          </span>
        </h2>
        <p className="text-base text-gray-600 mb-6">
          Please select your role to continue
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login?type=candidate"
            className="flex items-center justify-center gap-2 bg-[#4A628A] text-white px-6 py-3 rounded-lg hover:bg-[#89b4d4] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-semibold"
            aria-label="Log in as a candidate"
          >
            <User size={20} /> I'm a Candidate
          </Link>

          <Link
            to="/login?type=employer"
            className="flex items-center justify-center gap-2 bg-[#4A628A] text-white px-6 py-3 rounded-lg hover:bg-[#89b4d4] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors font-semibold"
            aria-label="Log in as an employer"
          >
            <Briefcase size={20} /> I'm an Employer
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-black hover:text-purple-500 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            aria-label="Sign up for an account"
          >
            Sign up here
          </Link>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <img
          src={IHireboy}
          alt="IHire mascot"
          className="w-full h-auto max-h-96 object-contain rounded-lg"
        />
      </div>

      {/* Tailwind Animation Classes */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserType;