import IconBadge from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import { ChapterAccessForm } from './_components/chapter-access-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { Banner } from '@/components/banner';
import { ChapterActions } from './_components/chapter-actions';

const ChapterIdPage = async (
    {params}: {params: {courseId: string; chapterId: string}}
) => {
    const {userId} = auth()

    if(!userId) {
        return redirect("/")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]

    const completeFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;

    const completed = `(${completeFields}/ ${totalFields})`

    const isComplete = requiredFields.every(Boolean)

  return (
    <>
        {!chapter.isPublished && (
            <Banner 
                variant="warning"
                label="This chapter is unpublished"
            />
        )}
        <div className='p-6'>
            <div>
                <div>
                    <Link
                        href={`/teacher/courses/${params.courseId}`}
                        className='items-center flex'
                    >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to course dashboard
                    </Link>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className=''>
                                Chapter creation
                            </h1>
                            <span>
                                Complete all fields {completed}
                            </span>
                        </div>
                        <ChapterActions 
                            disabled={!isComplete}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                            isPublished={chapter.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 space-x-9 items-center'>
                <div>
                    <div>
                        <div className='flex items-center mb-2 gap-x-3 mt-5'>
                            <IconBadge icon={LayoutDashboard}/>
                            <h2>Customize your chapter</h2>
                        </div>
                        <ChapterTitleForm 
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                        <ChapterDescriptionForm 
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                    <div>
                        <div className='flex items-center'>
                            <IconBadge icon={Eye} />
                            <h2>Access Settings</h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-2 mt-8'>
                        <IconBadge icon={Video} />
                        <h2 className=''>Add a video</h2>
                    </div>
                    <ChapterVideoForm 
                        initialData={chapter}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                    />
                </div>
            </div>
        </div>
    </>
  )
}

export default ChapterIdPage