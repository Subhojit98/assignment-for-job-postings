"use client"
import { useState } from "react";
import JobLists from "./components/joblists";
import ResumeUploader from "./components/resume-uploader";

export type Job = {
  job_title: string;
  job_location?: string;
  company_name?: string;
  job_description: string;
  source?: string;
  apply_link?: string;
};

export type ResumeSearch = {
  data?: {
    jobs: Job[];
  };
} | null;

export default function Home() {

  const [resumeSearch, setResumeSearch] = useState<ResumeSearch | null>(null);
  return (
    <main className="w-full h-screen">

      {!resumeSearch && <ResumeUploader setResumeSearch={setResumeSearch} />}
      {resumeSearch && <JobLists resumeSearch={resumeSearch} />}

    </main>
  );
}
