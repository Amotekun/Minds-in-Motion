import IconBadge from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import { TitleForm } from './_components/title-form';
import { CourseDescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import { ChaptersForm } from './_components/chapter-form';

const CourseIdPage = async ({
    params
}: {params: {courseId: string}}) => {
  const {userId} = auth();

  if(!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });


  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });


  if (!course) {
    return redirect("/");
  };

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length

  const completedSection = `(${completedFields} / ${totalFields})`

  return (
    <div className='p-6 '>
      <div className=''>
        <div>
          <h1>Upload your course</h1>
          <span>Please complete all fields required {completedSection}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2'>
        <div>
          <div className='flex items-center  gap-x-2'>
            <IconBadge icon={LayoutDashboard}/>
            <h2 className='text-xl'>
              Customize your course
            </h2>
          </div>
          <TitleForm 
            initialData={course}
            courseId={course.id}
          />
          <CourseDescriptionForm
            initialData={course}
            courseId={course.id}
          />
          <ImageForm 
            initialData={course}
            courseId={course.id}
          />
          <CategoryForm 
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id
            }))}
          />
        </div>
        <div className='sm:ml-9 max-sm:mt-8'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={ListChecks} />
              <h2>Course chapters</h2>
            </div>
            <ChaptersForm 
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={CircleDollarSign} />
              <h2 className='text-xl'> Sell your course </h2>
            </div>
              <PriceForm 
              initialData={course}
              courseId={course.id}
              />
          </div>
          <div>
            <div className='flex mt-8 items-center'>
              <IconBadge icon={File} />
              <h2>Resources and attachement</h2>
            </div>
                <AttachmentForm 
                  initialData={course}
                  courseId={course.id}
                />
          </div>
        </div>

      </div>
    </div>
  )
}

export default CourseIdPage;