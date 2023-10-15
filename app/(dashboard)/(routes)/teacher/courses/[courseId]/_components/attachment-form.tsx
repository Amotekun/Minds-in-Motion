"use client"

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, Loader, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import toast from "react-hot-toast";
import * as z  from "zod";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[]}
    courseId: string
};

const formSchema = z.object({
    url: z.string().min(1)
});

export const AttachmentForm = ({initialData, courseId}: AttachmentFormProps) => {
    const [isEditting, setIsEditting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditting((current) => !current)

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Attachment added"); 
            toggleEdit()
            
        } catch {
            toast.error("Something went wrong")
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border  bg-slate-100 rounded-md p-4">
            <div>
                Course attachments
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                >
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div>
                            {initialData.attachments.map((attachment) => (
                                <div 
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className=""/>
                                    <p>
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader className="animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => {onDelete(attachment.id)}}
                                            className=""
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditting && (
                <div>
                    <FileUpload 
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({url: url});
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}