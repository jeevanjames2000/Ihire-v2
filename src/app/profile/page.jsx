"use client";
import {  useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import theme from '../../../theme.json';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';

const ProfileForm = () => {
  const { user, token } = useSelector((state) => state.auth);
  console.log("user",user)
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    profile_picture: '',
    resume: '',
    resume_headline: '',
    career_profile: '',
    certifications: '',
    skills: '',
    education: '',
    experience: '',
    job_preferences: '',
    notification_settings: 'email',
  });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    project_title: '',
    associated_with: '',
    client: '',
    project_status: 'ongoing',
    start_year: '',
    start_month: '',
    end_year: '',
    end_month: '',
    description: '',
    project_location: '',
    project_site: '',
    employment_nature: 'full-time',
    team_size: '',
    role: '',
    role_description: '',
    skills_used: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

useEffect(()=>{
fetchProfile()
console.log("process.env.NEXT_PUBLIC_URL}",process.env.NEXT_PUBLIC_API_URL)
},[user,token])

const fetchProfile=async()=>{
  try {
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/${user?.id}`)
    const data=await res.json()
  } catch (error) {
    console.log("error",error)
  }
}
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setMessage({ text: '', type: '' });
  };

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const addProject = () => {
    setProjects([...projects, newProject]);
    setNewProject({
      project_title: '',
      associated_with: '',
      client: '',
      project_status: 'ongoing',
      start_year: '',
      start_month: '',
      end_month: '',
      end_year: '',
      description: '',
      project_location: '',
      project_site: '',
      employment_nature: 'full-time',
      team_size: '',
      role: '',
      role_description: '',
      skills_used: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage({ text: 'User not logged in. Please log in again.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profileData, projects }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateUser({ ...user, ...profileData, projects }));
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to connect to the server. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button
            className={`bg-gradient-to-r ${theme.buttons?.primary?.bg || 'from-blue-500'} ${theme.buttons?.primary?.to || 'to-blue-700'} 
              ${theme.buttons?.primary?.text || 'text-white'}`}
          >
            Home
          </Button>
        </Link>
        {user?.id && (
          <div className="flex items-center space-x-4">
            <Avatar className="cursor-pointer">
              <AvatarFallback>{user.name ? user.name[0] : 'U'}</AvatarFallback>
            </Avatar>
            <Link href="/saved-jobs">
              <Button variant="outline" size="sm">Saved Jobs</Button>
            </Link>
          </div>
        )}
        {/* <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-5 w-5 md:hidden" />
        </Button> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-lg font-semibold">Complete Your Profile</h2>
        {message.text && (
          <div className={`text-sm text-center p-2 rounded ${message.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Input name="phone" placeholder="Enter phone number" value={profileData.phone} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <Input name="address" placeholder="Enter address" value={profileData.address} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <Input name="date_of_birth" type="date" value={profileData.date_of_birth} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <Select name="gender" value={profileData.gender} onValueChange={(value) => handleProfileChange({ target: { name: 'gender', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Profile Picture URL</label>
          <Input name="profile_picture" placeholder="Enter profile picture URL" value={profileData.profile_picture} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Resume URL</label>
          <Input name="resume" placeholder="Enter resume URL" value={profileData.resume} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Resume Headline</label>
          <Input name="resume_headline" placeholder="Enter resume headline" value={profileData.resume_headline} onChange={handleProfileChange} maxLength={255} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Career Profile</label>
          <Textarea name="career_profile" placeholder="Describe your career goals" value={profileData.career_profile} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Certifications</label>
          <Textarea name="certifications" placeholder="List certifications" value={profileData.certifications} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Skills</label>
          <Input name="skills" placeholder="Enter skills (comma-separated)" value={profileData.skills} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Education</label>
          <Input name="education" placeholder="Enter education details" value={profileData.education} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Experience</label>
          <Input name="experience" placeholder="Enter experience details" value={profileData.experience} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Job Preferences</label>
          <Input name="job_preferences" placeholder="Enter job preferences" value={profileData.job_preferences} onChange={handleProfileChange} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Notification Settings</label>
          <Select name="notification_settings" value={profileData.notification_settings} onValueChange={(value) => handleProfileChange({ target: { name: 'notification_settings', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select notification setting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

     
        <h3 className="text-md font-semibold">Projects</h3>
        {projects.map((project, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <p><strong>Title:</strong> {project.project_title}</p>
            <p><strong>Status:</strong> {project.project_status}</p>
            {/* Add more project details as needed */}
            <Button variant="destructive" size="sm" onClick={() => setProjects(projects.filter((_, i) => i !== index))}>Remove</Button>
          </div>
        ))}
        <div className="space-y-4">
          <Input name="project_title" placeholder="Project Title" value={newProject.project_title} onChange={handleProjectChange} className="w-full" />
          <Input name="associated_with" placeholder="Associated With" value={newProject.associated_with} onChange={handleProjectChange} className="w-full" />
          <Input name="client" placeholder="Client" value={newProject.client} onChange={handleProjectChange} className="w-full" />
          <Select name="project_status" value={newProject.project_status} onValueChange={(value) => handleProjectChange({ target: { name: 'project_status', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Project Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
            </SelectContent>
          </Select>
          <Input name="start_year" type="number" placeholder="Start Year" value={newProject.start_year} onChange={handleProjectChange} className="w-full" />
          <Input name="start_month" placeholder="Start Month" value={newProject.start_month} onChange={handleProjectChange} className="w-full" />
          <Input name="end_year" type="number" placeholder="End Year" value={newProject.end_year} onChange={handleProjectChange} className="w-full" />
          <Input name="end_month" placeholder="End Month" value={newProject.end_month} onChange={handleProjectChange} className="w-full" />
          <Textarea name="description" placeholder="Description" value={newProject.description} onChange={handleProjectChange} className="w-full" />
          <Input name="project_location" placeholder="Project Location" value={newProject.project_location} onChange={handleProjectChange} className="w-full" />
          <Input name="project_site" placeholder="Project Site" value={newProject.project_site} onChange={handleProjectChange} className="w-full" />
          <Select name="employment_nature" value={newProject.employment_nature} onValueChange={(value) => handleProjectChange({ target: { name: 'employment_nature', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Employment Nature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
          <Input name="team_size" type="number" placeholder="Team Size" value={newProject.team_size} onChange={handleProjectChange} className="w-full" />
          <Input name="role" placeholder="Role" value={newProject.role} onChange={handleProjectChange} className="w-full" />
          <Input name="role_description" placeholder="Role Description" value={newProject.role_description} onChange={handleProjectChange} className="w-full" />
          <Input name="skills_used" placeholder="Skills Used (comma-separated)" value={newProject.skills_used} onChange={handleProjectChange} className="w-full" />
          <Button type="button" onClick={addProject} className={`w-full bg-gradient-to-r ${theme.buttons?.primary?.bg || 'from-blue-500'} ${theme.buttons?.primary?.to || 'to-blue-700'} hover:from-blue-600 hover:to-blue-800 ${theme.buttons?.primary?.text || 'text-white'}`}>
            Add Project
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${theme.buttons?.primary?.bg || 'from-blue-500'} ${theme.buttons?.primary?.to || 'to-blue-700'} 
              hover:from-blue-600 hover:to-blue-800 ${theme.buttons?.primary?.text || 'text-white'}`}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;