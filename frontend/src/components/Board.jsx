
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './../index.css'
import AnimatedBackground from './AnimatedBackground';

// Initial Data
const initialEpisodes = [
  { id: 'ep1', title: 'EP-02: Master System Design ', status: 'draft' },
  { id: 'ep2', title: 'EP-01: Learn MERN', status: 'recorded' },
];

const Board = () => {
  const [episodes, setEpisodes] = useState(initialEpisodes);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedEpisodes = [...episodes];
    const [movedItem] = updatedEpisodes.splice(result.source.index, 1);
    movedItem.status = result.destination.droppableId;
    updatedEpisodes.splice(result.destination.index, 0, movedItem);

    setEpisodes(updatedEpisodes);
  };
  
return (
  <DragDropContext onDragEnd={onDragEnd}>
      {/* <AnimatedBackground /> */}
      <div className="relative flex gap-6 p-6 justify-center z-10">
          {['draft', 'recorded', 'published'].map((status) => (
              <div key={status} className="flex flex-col w-64 bg-white rounded-lg shadow-md p-2">
                  <h2 className="text-white text-lg font-bold p-2 text-center bg-indigo-500 rounded-t-md">
                      {status.toUpperCase()}
                  </h2>
                  <Droppable droppableId={status}>
                      {(provided) => (
                          <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[200px] bg-gray-100 p-2 rounded-b-md flex flex-col gap-2"
                          >
                              {episodes
                                  .filter((ep) => ep.status === status)
                                  .map((ep, index) => (
                                      <Draggable key={ep.id} draggableId={ep.id} index={index}>
                                          {(provided) => (
                                              <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="p-2 bg-white shadow-md rounded-md cursor-pointer"
                                              >
                                                  {ep.title}
                                              </div>
                                          )}
                                      </Draggable>
                                  ))}
                              {provided.placeholder}
                          </div>
                      )}
                  </Droppable>
              </div>
          ))}
      </div>
  </DragDropContext>
);
};

export default Board;

