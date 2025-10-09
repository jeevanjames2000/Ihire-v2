import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaClipboardList,
  FaBell,
  FaStar,
  FaBriefcase,
  FaPlusCircle,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";

// Candidate Sidebar
export const candidateSidebarItems = [
  { icon: FaHome, label: "Dashboard", path: "/dashboard" },
  { icon: FaUser, label: "My Profile", path: "/caddetails" },
  { icon: FaFileAlt, label: "My Resume", path: "/resume" },
  { icon: FaClipboardList, label: "Applied Jobs", path: "/applied" },
  { icon: FaBell, label: "Job Alerts", path: "/job-alerts" },
  { icon: FaStar, label: "Shortlisted Jobs", path: "/shortlisted-jobs" },
];

// Employee Sidebar
export const employeeSidebarItems = [
  { icon: FaHome, label: "Dashboard", path: "/empdashboard" },
  { icon: FaBriefcase, label: "Job Listings", path: "/joblisting" },
  { icon: FaPlusCircle, label: "Post a Job", path: "/empposting" },
  { icon: FaUsers, label: "Applicants",   path: "/applicants"},




  { icon: FaBuilding, label: "Company Profile", path: "/cmpprofile" },
  // { icon: FaUser, label: "My Profile", path: "/empprofile" },
];
