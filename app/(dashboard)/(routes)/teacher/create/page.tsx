"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form"
import * as z from "zod";
import axios from "axios";


import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 characters."
    })
});


const CreatePage = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`)
            toast.success("Course successfully created")
        } catch {
            toast.error("Something went wrong")
        }
    };

  return (
    <div className="w-full md:items-center md:justify-center flex mx-auto h-screen p-6 ">
        <div>
            <h1 className="text-2xl">Course</h1>
            <p className="text-sm text-slate-600">Upload your courses, and make sure the content is well detailed</p>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-8 mt-8"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isSubmitting}
                                        placeholder="Graphics design"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Thank you for your service
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Link href={"/"}>
                            <Button
                                type="button"
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                                type="submit"
                                disabled={isSubmitting || !isValid}

                            >
                               Continue
                            </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default CreatePage