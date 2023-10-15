"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});


export const ImageForm = ({initialData, courseId}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course title updated");
            toggleEdit()
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }


  return (
    <div className="bg-slate-100 rounded-md mt-4 p-4">
        <div className="flex  items-center gap-9 ">
            Course Image
            <Button
                variant="ghost"
                onClick={toggleEdit}
            >
                {isEditing && (
                    <>Cancel</>
                )} 
                {!isEditing && !initialData.imageUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an Image
                    </>
                )}
                {!isEditing && initialData.imageUrl && (
                    <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit image
                    </>
                )}
            </Button>
        </div>
            {!isEditing && (
            !initialData.imageUrl ? (
                <div className="flex items-center justify-center ">
                    <ImageIcon className="h-10 w-10 text-slate-500" />
                </div>
            ): (
                <div className="relative aspect-video mt-2">
                    <Image 
                        alt="Upload"
                        fill
                        className="object-cover"
                        src={initialData.imageUrl}
                    />
                </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({imageUrl: url})
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
    </div>
  )
}
