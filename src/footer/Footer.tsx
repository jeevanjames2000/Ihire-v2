import React from "react";
import Image from "next/image";
const Logo: React.FC = () => {
  return (
    <div className="bg-[#48adb9] text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold p-2 rounded inline-block">
      iHire
    </div>
  );
};
const Footer: React.FC = () => {
  return (
    <footer
      className="bg-gradient-to-r from-[#48adb9] to-[#2a6b73] text-white font-sans relative py-8 sm:py-10 lg:py-14 min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[500px] flex flex-col"
    >
      {}
      <div className="absolute inset-0 bg-black/0 sm:bg-black/5 md:bg-black/5"></div>
      {}
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10 px-4 sm:px-6 md:px-8 flex-1">
        {}
        <div className="hidden lg:block lg:w-1/3 xl:w-1/4">
          <Image
            src="/jobseeker.jpg"
            alt="Job Seeker"
            width={400}
            height={350}
            className="w-full h-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] object-cover rounded-lg"
            priority
          />
        </div>
        {}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {}
          <div>
            <Logo className="mb-2 sm:mb-3" />
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">Job Seekers</h3>
              {[
                "Find Jobs",
                "Upload Resume",
                "Career Advice",
                
                "Job Alerts",
               
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          {}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">Employers</h3>
            {[
              "Post a Job",
              "Search Resumes",
              "Employer Dashboard",
              "Pricing Plans",
              "Recruitment Services",
              "Customer Support",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
              >
                {item}
              </a>
            ))}
          </div>
          {}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">Company</h3>
            {[
              "About iHire",
              "Our Team",
              "Careers at iHire",
              "Press & News",
              "Contact Us",
              "Privacy Policy",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-xs sm:text-sm md:text-base hover:text-orange-300 transition-colors mt-1 sm:mt-2 text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
      {}
      <div className="text-center border-t border-white/20 mt-6 sm:mt-8 pt-4 sm:pt-4 text-xs sm:text-sm text-gray-200">
        © 2025 iHire Job Portal Inc. | Terms of Service | Privacy Policy | Cookie Policy | Support
      </div>
    </footer>
  );
};
export default Footer;