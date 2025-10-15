import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="bg-[#48adb9] text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold p-2 rounded inline-block">
      iHire
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#48adb9] to-[#2a6b73] text-white font-sans relative py-8 sm:py-10 md:py-12 lg:py-14 min-h-[250px] flex flex-col">
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10 px-5 sm:px-8 md:px-10 flex-1 w-full">
        {/* Links Section */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Job Seekers */}
          <div>
            <Logo />
            <div className="mt-4">
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                Job Seekers
              </h3>
              {[
                { name: "Find Jobs", link: "/jobs" },
                { name: "Job Alerts", link: "/job-alerts" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="block text-sm md:text-base text-white py-1 hover:text-orange-300 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Employers */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
              Employers
            </h3>
            {[
              { name: "Post a Job", link: "/employers/post-job" },
              { name: "Employer Dashboard", link: "/employers/dashboard" },
              { name: "Recruitment Services", link: "/services" },
              { name: "Customer Support", link: "/support" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="block text-sm md:text-base text-white py-1 hover:text-orange-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
              Company
            </h3>
            {[
              { name: "About iHire", link: "/about" },
              { name: "Careers at iHire", link: "/careers" },
              { name: "Privacy Policy", link: "/privacy" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="block text-sm md:text-base text-white py-1 hover:text-orange-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-center lg:justify-end">
          <Image
            src="/jobseeker.jpg"
            alt="Job Seeker"
            width={400}
            height={350}
            className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative text-center border-t border-white/20 mt-8 pt-4 pb-4 text-xs sm:text-sm text-gray-200">
        © {new Date().getFullYear()} iHire Job Portal Inc. |{" "}
        <Link href="/terms" className="hover:text-orange-300">
          Terms of Service
        </Link>{" "}
        |{" "}
        <Link href="/privacy" className="hover:text-orange-300">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="/support" className="hover:text-orange-300">
          Support
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
