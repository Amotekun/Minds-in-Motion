"use client"

import { Chapter } from "@prisma/client";
import {DragDropContext, Draggable, DropResult, Droppable} from "@hello-pangea/dnd"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onReorder: (updateData: {id: string; position: number}[]) => void;
    onEdit: (id: string) => void;
}

export const ChaptersList = ({items, onReorder, onEdit}: ChaptersListProps) => {
    const [chapters, setChapters] = useState(items)
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        setChapters(items)
    }, [items]);


    //This function is called when a drag-and-drop action has ended, and it takes a result object that contains information about the source (where the drag started) and destination (where the drop occurred) of the dragged item.
    const onDragEnd = (result: DropResult) => {

        // This line checks if there is no valid destination for the dragged item. If there's no destination, it means the item was not dropped in a valid location, and the function returns early.
        if(!result.destination) return;

        //It creates a copy of the current list of chapters (chapters) to work with.
        const items = Array.from(chapters);

        //It removes the item that was dragged from the source position (the index from where it was dragged) and stores it as reorderedItem.
        const [reorderedItems] = items.splice(result.source.index, 1);

        //It inserts the reorderedItem at the destination position (the index where it was dropped) in the items list.
        items.splice(result.destination.index, 0, reorderedItems);

        // It calculates the index of the first item affected by the reordering, either the source or the destination index.
        const startIndex = Math.min(result.source.index, result.destination.index);

        // It calculates the index of the last item affected by the reordering.
        const endIndex = Math.max(result.source.index, result.destination.index);

        // It creates a sub-array of items that contains the chapters that were reordered. This sub-array includes the chapters that were moved and everything in between.
        const updatedChapters = items.slice(startIndex, endIndex + 1);

        // It updates the state with the reordered list of chapters. This is typically used to re-render the component with the new order.
        setChapters(items)

        // It prepares the data that will be used to update the positions of the reordered chapters. For each chapter in updatedChapters, it creates an object with the chapter's id and its new position in the list.
        const bulkUpdateData = updatedChapters.map((chapter, index) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        // It calls the onReorder function with the bulkUpdateData, which is an array of objects specifying the new positions of the reordered chapters. This function is typically used to update the order of chapters in the database or perform any other necessary actions.
        onReorder(bulkUpdateData);

        //In summary, this code is responsible for handling the reordering of chapters in a list, including updating the user interface (UI) and preparing data to update the order of chapters in a data store or database. It's commonly used in interfaces where users can change the order of items through drag-and-drop interactions.
    }

    if(!isMounted) {
        return null
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            chapter.isPublished && "bg-sky-200 border-sky-200 text-sky-200"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip 
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        {chapter.title}
                                        <div className="items-center pr-2 ml-auto gap-x-2 flex ">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge 
                                                className={cn(
                                                    "bg-slate-500",
                                                    chapter.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {chapter.isPublished ? "Published" : "Draft"} 
                                            </Badge>                      
                                            <Pencil 
                                                onClick={() => onEdit(chapter.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable> 
        </DragDropContext>
    )
}