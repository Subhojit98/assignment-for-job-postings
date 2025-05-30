"use client"
import Image from 'next/image'
import { useState } from 'react'
import aiStarSvg from '@/assets/svgs/christmas-stars.svg'
import { ArrowRight, FileUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import axios from 'axios'
import { toast } from 'sonner'
import { ResumeSearch } from '../page'


const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ResumeUploader = ({ setResumeSearch }: { setResumeSearch: (value: ResumeSearch | null) => void }) => {

    const [file, setFile] = useState<File | null>(null)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            setFile(selectedFile)
        } else {
            setFile(null)
            toast.error('Only PDF and Word files are allowed.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()

        if (file) {
            formData.append("resume", file)
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/upload-file/resume`, formData, {
                    headers: {
                        'Content-Type': "multipart/form-data",
                    },
                })

                if (res.status === 200) {
                    toast.success('File uploaded successfully!')

                    setResumeSearch(res.data)
                } else {
                    toast.error('Failed to upload file.')
                }
            } catch (error) {
                console.error('Error uploading file:', error)
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">

            <h1 className='text-center mt-10'><span className='block mb-4 text-xl sm:text-2xl'>👋 Hey There! </span><span className='font-semibold text-2xl sm:text-4xl'>Welcome to Hirebuddy</span></h1>
            <form onSubmit={handleSubmit} className='w-11/12 lg:w-1/2 h-auto mx-auto my-10 p-8 border border-gray-200 rounded-lg shadow-lg bg-white'>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className='font-semibold text-sm sm:text-2xl'>Upload and attach Resume</h2>
                        <p className='text-gray-600 mt-1.5 text-xs sm:text-base'>Upload and attach the resume here</p>
                    </div>
                    <Image src={aiStarSvg} alt='svg star' className='w-8 h-8 sm:w-10 sm:h-10' />
                </div>

                {/* uploader */}
                <div className="flex items-center justify-center w-full mt-10">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-80 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp size={50} className='my-2 mb-4' />
                            <p className="mb-2 text-sm"><span className="font-semibold"><span className='underline'>Click to upload</span></span> or drag and drop</p>
                            <p className="text-xs text-gray-500">Maximum size is 50 MB.</p>
                        </div>
                        <input accept=".pdf,.doc,.docx" onChange={handleFileChange} formEncType='multipart/form-data' name='resume' id="dropzone-file" type="file" className={cn(!file && "hidden")} />
                    </label>
                </div>
                <div className="w-full flex justify-center mt-10">
                    <Button disabled={!file} className='py-6 cursor-pointer w-full sm:w-[30%]'>
                        Next
                        <ArrowRight size={5} />
                    </Button>
                </div>
            </form>


        </div>

    )
}

export default ResumeUploader
