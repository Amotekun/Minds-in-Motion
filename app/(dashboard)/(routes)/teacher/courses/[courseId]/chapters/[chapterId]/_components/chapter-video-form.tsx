"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & {muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1,)
});


export const ChapterVideoForm = ({initialData, courseId, chapterId}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit()
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }


  return (
    <div className="bg-slate-100 rounded-md mt-4 p-4">
        <div className="flex  items-center gap-9 ">
            Course Video
            <Button
                variant="ghost"
                onClick={toggleEdit}
            >
                {isEditing && (
                    <>Cancel</>
                )} 
                {!isEditing && !initialData.videoUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a Video
                    </>
                )}
                {!isEditing && initialData.videoUrl && (
                    <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Video
                    </>
                )}
            </Button>
        </div>
            {!isEditing && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center ">
                    <Video className="h-10 w-10 text-slate-500" />
                </div>
            ): (
                <div className="relative aspect-video mt-2">
                    <MuxPlayer 
                        playbackId={initialData.muxData?.playbackId || ""}
                    />
                </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({videoUrl: url})
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload video here for your chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos sometimes take a few minutes to upload.
                </div>
            )}
    </div>
  )
}
