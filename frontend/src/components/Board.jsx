import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import './../index.css';

const Board = () => {
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState('');

  // Fetch episodes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/episodes').then((res) => setEpisodes(res.data));
  }, []);

  // Handle drag-and-drop updates
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedEpisodes = [...episodes];
    const [movedItem] = updatedEpisodes.splice(result.source.index, 1);
    movedItem.status = result.destination.droppableId;
    updatedEpisodes.splice(result.destination.index, 0, movedItem);

    setEpisodes(updatedEpisodes);

    // Update in backend
    await axios.put(`http://localhost:5000/episodes/${movedItem._id}`, {
      status: movedItem.status,
    });
  };

  // Add new episode
  const addEpisode = async () => {
    if (!newEpisode.trim()) return;

    const { data } = await axios.post('http://localhost:5000/episodes', {
      title: newEpisode,
      status: 'draft',
    });

    setEpisodes([...episodes, data]);
    setNewEpisode('');
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Add Episode Input */}
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={newEpisode}
          onChange={(e) => setNewEpisode(e.target.value)}
          placeholder="Add a new episode..."
          className="flex-grow p-2 border rounded-md"
        />
        <button
          onClick={addEpisode}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
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
                        <Draggable key={ep._id} draggableId={ep._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-2 bg-white shadow-md rounded-md cursor-pointer hover:bg-gray-50 transition-all"
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
    </div>
  );
};

export default Board;
