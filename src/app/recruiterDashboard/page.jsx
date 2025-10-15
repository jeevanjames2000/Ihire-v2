"use client";
import { Briefcase, PlusCircle, Users, Building, BarChart, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchEmployerDashboard, clearDashboard } from "../../store/dashboardSlice";
import { createSelector } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import SendInviteForm from "../../components/invites/SendInviteForm";
export const dynamic = 'force-dynamic';
// Memoized selectors for stability
const selectUserState = createSelector(
  [(state) => state.user || {}],
  (user) => ({
    userInfo: user.userInfo || null,
    userType: user.userType || null,
  })
);

const selectDashboardState = createSelector(
  [(state) => state.dashboard || {}],
  (dashboard) => ({
    profile: dashboard.profile || null,
    notifications: dashboard.notifications || [],
    jobs: dashboard.jobs || [],
    stats: dashboard.stats || { activePostings: 0, totalApplications: 0, views: 0 },
    isLoading: dashboard.isLoading || false,
    error: dashboard.error || null,
  })
);

// Card Components
const WelcomeCard = ({ profile, userInfo }) => (
  <div className="rounded-lg border flex justify-center items-center border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] w-full">
    <h4 className="text-xl font-semibold mr-2 text-gray-800 dark:text-white/90 mb-4">
      Welcome, {profile?.name || userInfo?.name || "Employee"}
    </h4>
    <Link
      href="/EmpPosting"
      className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all duration-300 text-sm w-full sm:w-auto text-center"
    >
      <PlusCircle className="inline w-4 h-4 mr-2" />
      Post New Job
    </Link>
  </div>
);

const AnalyticsCard = ({ stats }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <BarChart className="text-teal-500 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Analytics Overview</h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="text-center p-2">
        <p className="text-2xl font-semibold text-teal-600">{stats.activePostings || 0}</p>
        <p className="text-gray-900 text-sm">Active Postings</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-semibold text-teal-600">{stats.totalApplications || 0}</p>
        <p className="text-gray-900 text-sm">Total Applicants</p>
      </div>
      <div className="text-center p-2">
        <p className="text-2xl font-semibold text-teal-600">{stats.views || 0}</p>
        <p className="text-gray-900 text-sm">Job Views</p>
      </div>
    </div>
  </div>
);

const JobListingsCard = ({ jobs }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <Briefcase className="text-indigo-500 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Job Listings</h4>
    <p className="text-gray-900 mb-4 text-sm">
      {jobs.length || 0} jobs available {jobs.length === 0 && "No jobs available yet"}
    </p>
    <Link href="/joblisting" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm">
      Explore Jobs →
    </Link>
  </div>
);

const PostingsCard = ({ jobs }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <PlusCircle className="text-teal-500 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Your Postings</h4>
    <p className="text-gray-900 mb-4 text-sm">
      {jobs.length || 0} active jobs {jobs.length === 0 && "No active jobs yet"}
    </p>
    {/* <Link href="/empposting" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors text-sm">
      Manage Jobs →
    </Link> */}
  </div>
);

const ApplicantsCard = ({ stats }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <Users className="text-rose-500 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Recent Applicants</h4>
    <p className="text-gray-900 mb-4 text-sm">
      {stats.totalApplications || 0} new applicants {stats.totalApplications === 0 && "No applicants yet"}
    </p>
    {/* <Link href="/applicants" className="text-rose-600 hover:text-rose-800 font-semibold transition-colors text-sm">
      Review Applicants →
    </Link> */}
  </div>
);

const CompanyProfileCard = ({ profile, userInfo }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <Building className="text-indigo-600 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Company Profile</h4>
    <p className="text-gray-900 mb-4 text-sm">
      {profile?.company_name ? `Manage ${profile.company_name}` : "Update your company details"}
    </p>
    {/* <Link href="/profile" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm">
      Edit Profile →
    </Link> */}
  </div>
);

const JobPerformanceCard = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <BarChart className="text-rose-600 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Job Performance</h4>
    <p className="text-gray-900 mb-4 text-sm">Track job views and applications</p>
    {/* <Link href="/jobperformance" className="text-rose-600 hover:text-rose-800 font-semibold transition-colors text-sm">
      View Metrics →
    </Link> */}
  </div>
);

const TeamCollaborationCard = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <Share2 className="text-teal-600 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Team Collaboration</h4>
    <p className="text-gray-900 mb-4 text-sm">Invite team members to collaborate</p>
    <Link href="/teamcollaboration" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors text-sm">
      Invite →  
    </Link>
  </div>
);

const InterviewsCard = ({ notifications }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <Calendar className="text-indigo-500 w-6 h-6 mb-3" />
    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Scheduled Interviews</h4>
    <p className="text-gray-900 mb-4 text-sm">
      {notifications.filter((n) => n.type === "interview")?.length || 0} upcoming interviews
      {notifications.filter((n) => n.type === "interview")?.length === 0 && " No upcoming interviews"}
    </p>
    {/* <Link href="/interviews" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm">
      View Schedule →
    </Link> */}
  </div>
);

const EmpDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo, userType } = useSelector(selectUserState);
  const { profile, notifications, jobs, stats, isLoading, error } = useSelector(selectDashboardState);
  console.log("profile", profile);
  console.log("jobs", jobs);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const token = userInfo?.token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);

  useEffect(() => {
    // Authentication and role check (commented out as per your code)
    const normalizedUserType = userType?.toLowerCase();
    const allowedRoles = ["employer", "admin", "company"];

    // Timeout for API call
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setTimeoutReached(true);
        toast.error("Request timed out. Please try again.");
      }
    }, 10000);

    dispatch(fetchEmployerDashboard());

    return () => {
      clearTimeout(timeoutId);
      dispatch(clearDashboard());
    };
  }, [dispatch, router, userInfo, userType, token]);

  // Error handling (commented out as per your code)
  // if (error) { ... }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 p-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 w-full">
        <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
         Recruiter Dashboard
        </h3>
        {isLoading && !timeoutReached ? (
          <div className="flex flex-col justify-center items-center py-8 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="text-gray-600 text-sm">Loading dashboard...</span>
          </div>
        ) : (
          <>
            <WelcomeCard profile={profile} userInfo={userInfo} />
            <div className=" mx-auto mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalyticsCard stats={stats} />
                <JobListingsCard jobs={jobs} />
                <PostingsCard jobs={jobs} />
                <ApplicantsCard stats={stats} />
                <CompanyProfileCard profile={profile} userInfo={userInfo} />
                <JobPerformanceCard />
                <TeamCollaborationCard />
                <InterviewsCard notifications={notifications} />
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmpDashboard;