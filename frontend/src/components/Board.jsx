import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import "./../index.css";

const Board = () => {
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch episodes with error handling
  const fetchEpisodes = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/episodes");
      setEpisodes(data);
    } catch (err) {
      console.error("Failed to fetch episodes:", err);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  // Optimized drag handler with transaction ID
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const transactionId = Date.now(); // For conflict resolution
    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;

    // Optimistic UI update
    setEpisodes((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(result.source.index, 1);
      movedItem.status = destStatus;
      updated.splice(result.destination.index, 0, movedItem);
      return updated;
    });

    try {
      await axios.put(`http://localhost:5000/episodes/${result.draggableId}`, {
        status: destStatus,
        lastModified: transactionId,
      });
    } catch (err) {
      // Rollback on error
      fetchEpisodes();
      console.error("Sync failed:", err);
    }
  };

  // Debounced episode addition
  const addEpisode = async () => {
    if (!newEpisode.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const { data } = await axios.post("http://localhost:5000/episodes", {
        title: newEpisode.trim(),
        status: "draft",
      });
      setEpisodes((prev) => [...prev, data]);
      setNewEpisode("");
    } catch (err) {
      console.error("Failed to add episode:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={newEpisode}
          onChange={(e) => setNewEpisode(e.target.value)}
          placeholder="Enter episode title..."
          className="flex-grow p-2 border rounded-md"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && addEpisode()}
        />
        <button
          onClick={addEpisode}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md shadow-md ${
            isSaving
              ? "bg-gray-400"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          {isSaving ? "Adding..." : "Add"}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-6 p-6 justify-center">
          {["draft", "recorded", "published"].map((status) => (
            <div
              key={status}
              className="flex flex-col w-64 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-white text-lg font-bold p-2 text-center bg-indigo-500 rounded-t-md">
                {status.toUpperCase()} (
                {episodes.filter((e) => e.status === status).length})
              </h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px] bg-gray-50 p-2 rounded-b-md flex flex-col gap-2"
                  >
                    {episodes
                      .filter((ep) => ep.status === status)
                      .map((ep, index) => (
                        <Draggable
                          key={ep._id}
                          draggableId={ep._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="group p-3 bg-white shadow-sm rounded-md border border-gray-200 hover:border-indigo-300 transition-all"
                            >
                              <h3 className="font-medium">{ep.title}</h3>
                              {ep.duration && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {ep.duration} min
                                </span>
                              )}
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
