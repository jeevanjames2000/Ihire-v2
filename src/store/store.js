import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice.js";
import dashboardReducer from "../store/dashboardSlice.js";
import profileReducer from "../store/profileSlice.js";
import candidateReducer from "../store/candidateSlice.js";
import jobsReducer from "../store/jobsSlice.js";
import resumeReducer from "../store/resumeSlice.js";
import footerReducer from "../store/footerSlice.js";
import  headerReducer from "../store/headerSlice.js";
import skillsReducer from "./skillsSlice.js";
import employeeReducer from "../store/empprofileSlice.js";
import companyReducer from "../store/companySlice.js";
import postingReducer from "../store/profileSlice.js";
import jobalertsReducer from "../store/jobalertSlice.js"
import categoriesReducer from "../store/categoriesSlice.js"
import authReducer from '../store/authSlice.js';
import applicantReducer from "../store/applicantSlice.js";




const store = configureStore({
  reducer: {
    auth:authReducer,
    user: userReducer,
     dashboard: dashboardReducer,
     profile: profileReducer,
       candidate: candidateReducer,
       jobs: jobsReducer,
          resume: resumeReducer,
            footer: footerReducer,
            header:headerReducer,
            skills: skillsReducer,
            employee: employeeReducer,
            company:companyReducer,
             postedJobs: postingReducer,
              jobalerts: jobalertsReducer, // ✅ add this
         
                 categories: categoriesReducer,
                  applicants: applicantReducer,
                   



    // postedJobs: postingReducer,
    // applicants: applicantReducer,
    // company: companyReducer,
  },
});

export default store;
