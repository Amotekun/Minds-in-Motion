"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    isFree: z.boolean().default(false),
});


export const ChapterAccessForm = ({initialData, courseId, chapterId}: ChapterAccessFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        } 
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Course title updated");
            toggleEdit()
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }


  return (
    <div className="bg-slate-100 rounded-md mt-4 p-4">
        <div className="flex items-center gap-9">
            Chapter access
            <Button
                variant="ghost"
                onClick={toggleEdit}
            >
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="" />
                        Edit access
                    </>
                )}
            </Button>
            <div>
                {isEditing ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=""
                        >
                            <FormField 
                                control={form.control}
                                name="isFree"
                                render={({field}) => (
                                    <FormItem className="flex items-center gap-2 ">
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                        <div>
                                            <FormDescription>
                                                Check this box if this course is for free
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="mt-3">
                                <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                ): (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.isFree && "text-slate-500 italic"
                        
                    )}>
                        {initialData.isFree ? (
                            <>This chapter is free for preview</>
                        ): (
                            <>This chapter is not free</>
                        )}
                    </p>
                )}
            </div>
        </div>
    </div>
  )
}
