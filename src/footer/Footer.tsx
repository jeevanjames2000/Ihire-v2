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
    <footer className="bg-gradient-to-r from-[#48adb9] to-[#2a6b73] text-white font-sans relative py-6 sm:py-8 lg:py-10 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] xl:min-h-[400px] flex flex-col">
      <div className="absolute inset-0 bg-black/0 sm:bg-black/5 md:bg-black/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 flex-1">
        {/* Links Section */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6 md:gap-8">
          {/* Job Seekers */}
          <div>
            <Logo />
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">
                Job Seekers
              </h3>
              {[
                { name: "Find Jobs", link: "/jobs" },
                { name: "Upload Resume", link: "/upload-resume" },
                { name: "Job Alerts", link: "/job-alerts" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">
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
                className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">
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
                className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-end">
          <Image
            src="/jobseeker.jpg"
            alt="Job Seeker"
            width={400}
            height={350}
            className="w-full h-auto max-h-[150px] sm:max-h-[200px] md:max-h-[250px] lg:max-h-[300px] xl:max-h-[350px] object-cover rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center border-t border-white/20 mt-4 sm:mt-6 pt-4 pb-4 text-xs sm:text-sm text-gray-200">
        © 2025 iHire Job Portal Inc. |{" "}
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