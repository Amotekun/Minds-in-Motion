"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapter-list";

interface DescriptionProps {
    initialData: Course & {chapters: Chapter[]};
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1)
});


export const ChaptersForm = ({initialData, courseId}: DescriptionProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreate= () => setIsCreating((current) => !current)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        } 
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters/`, values);
            toast.success("Chapter created");
            toggleCreate()
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }

    const onReorder = async (updateData: {id: string; position: number} []) => {
        try {
            setIsUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Chapter rearranged")
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }


  return (
    <div className="bg-slate-100 relative rounded-md mt-4 p-4">
        {isUpdating && (
            <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
            </div>
        )}
        <div className="flex  flex-col items-center gap-9">
            <div className="flex items-center">
            Course chapters
            <Button
                variant="ghost"
                onClick={toggleCreate}
            >
                {isCreating ? (
                    <>Cancel</>
                ): (
                    <>
                        <PlusCircle className="" />
                        Add a Chapter
                    </>
                )}
            </Button>
            </div>
            <div className="w-full">
                {isCreating ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=""
                        >
                            <FormField 
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                disabled={isSubmitting}
                                                placeholder="Name each chapters"
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
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Form>
                ): (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic" 
                    )}>
                        {!initialData.chapters.length && "No chapters "}
                        <ChaptersList 
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.chapters || []}
                        />
                    </p>
                )}
            </div>
        </div>
    </div>
  )
}
