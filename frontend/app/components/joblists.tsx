"use client"
import { ArrowRight, Building, Building2, ChevronRight, MapPin, Search, SearchX } from "lucide-react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Job, ResumeSearch } from "../page"



const JobLists = ({ resumeSearch }: { resumeSearch: ResumeSearch }) => {

    const [allJobs, setAllJobs] = useState<Job[]>(resumeSearch?.data?.jobs || []);
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearched, setIsSearched] = useState(false);
    const [query, setQuery] = useState("");

    const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };


    const handleSearch = async () => {

        if (!searchQuery.trim()) {
            return;
        }


        setQuery(searchQuery.trim());
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/all-jobs/jobs?search=${searchQuery.trim()}`);
            if (response.status === 200) {
                setAllJobs(response?.data.data || []);
                setIsSearched(true);
            } else {
                toast.error("Failed to fetch jobs. Please try again.")
                console.error("Failed to fetch jobs:", response.data.message);
            }

        } catch (error) {
            console.error('Error fetching jobs:', error);
        }

    }


    return (
        <div className="w-[95%] lg:w-1/2 h-full mx-auto my-10 p-5 sm:p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
            <h1 className='mb-3 sm:mb-6 text-xl sm:text-2xl font-semibold inline-flex items-center gap-3'>Job Listings <ChevronRight size={25} /></h1>
            <p className="text-sm text-gray-500 mx-1">Milions of Jobs and opportunities</p>
            <div className="relative w-full mt-1.5">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    value={searchQuery}
                    onChange={handleSearchQuery}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    placeholder="Search by"
                    className="pl-10 py-5 sm:py-6 outline-none border-black"
                />
            </div>

            {isSearched && <div className="mt-5 mx-1">
                <span className="max-w-max bg-gray-50 text-neutral-700 rounded-sm text-xs px-2 py-2 font-semibold"> {allJobs.length} results found for {query}</span>
            </div>}

            <ul className=" h-[80%] mt-5 overflow-y-auto">

                {
                    allJobs.length > 0 ? allJobs?.map((job, i) => {
                        return <Card key={i} className="mt-5">
                            <CardHeader className="flex items-end gap-2">
                                <div className="w-20 h-20 bg-slate-200 rounded-md flex items-center justify-center">
                                    <Building />
                                </div>
                                <div className="flex flex-col gap-1 ml-2.5">
                                    <CardTitle className="textlg sm:text-xl">{job?.job_title}</CardTitle>
                                    <div >
                                        <span className="inline-flex items-center gap-2">
                                            <MapPin size={14} />
                                            <span className="text-xs text-gray-500">{job?.job_location || "Remote"}</span>
                                        </span>
                                    </div>
                                    <CardDescription className="text-xs text-gray-400 inline-flex items-center gap-2"><Building2 size={14} /> {job?.company_name}</CardDescription>
                                </div>
                            </CardHeader>
                            <Separator className="bg-gray-100 max-w-[96%] m-auto" />

                            <CardContent className="text-sm text-gray-600 leading-6">
                                <p className="text-xs font-semibold">Job Description:</p>

                                <HoverCard>
                                    <HoverCardTrigger>
                                        {`${job?.job_description.substring(0, 250)}...`}
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-96 sm:w-xl md:w-2xl lg:w-3xl xl:w-5xl">
                                        <p className="leading-6 text-xs sm:text-sm text-gray-600">{`${job?.job_description}`}</p>
                                    </HoverCardContent>
                                </HoverCard>

                            </CardContent>

                            <Separator className="bg-gray-100 max-w-[96%] m-auto" />

                            <CardFooter className="flex justify-between items-center">

                                <p className="text-xs sm:text-sm text-gray-500">Source: {job?.source || "Unknown"}</p>

                                <Link href={job?.apply_link || "#"} className={cn(
                                    buttonVariants({ variant: "default" }),
                                    "py-4 sm:py-6 cursor-pointer text-xs sm:text-sm inline-flex items-center gap-1"
                                )}>

                                    Apply Now
                                    <ArrowRight size={16} />

                                </Link>
                            </CardFooter>
                        </Card>

                    })
                        :
                        <div className="text-center mt-10">
                            <p className="text-red-500 inline-flex items-center gap-3"> <SearchX /> No jobs found for your search.</p>
                        </div>
                }

            </ul>
        </div>
    )
}

export default JobLists
