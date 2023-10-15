import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function PUT (
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const {userId} = auth()

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 }); 
        }

        const {list} = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        // this code is looping through a list of items, and updating their positions in the database. It uses the id to identify the specific chapter to update and the position to set the new position for each chapter. This is commonly used in applications where you need to reorder items or update their attributes in a database based on a specific order or criteria.
        for (let item of list ) {
            await db.chapter.update({
                where: {id: item.id},
                data: {position: item.position}
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}