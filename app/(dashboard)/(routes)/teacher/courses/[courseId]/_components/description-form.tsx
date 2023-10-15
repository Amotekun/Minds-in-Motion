"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface CourseDescriptionProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
});


export const CourseDescriptionForm = ({initialData, courseId}: CourseDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        } 
    });

    const {isSubmitting, isValid} = form.formState;

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
        <div className="flex items-center gap-9">
            Course Description
            <Button
                variant="ghost"
                onClick={toggleEdit}
            >
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="" />
                        Edit Description
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
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea 
                                                disabled={isSubmitting}
                                                placeholder="Give a brief descrption about your course"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                        !initialData.description && "text-slate-500 italic"
                        
                    )}>
                        {initialData.description || "No description"}
                    </p>
                )}
            </div>
        </div>
    </div>
  )
}
