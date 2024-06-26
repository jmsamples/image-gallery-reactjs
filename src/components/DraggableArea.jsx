import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import DragItem from "./DragItem";
import { Sortable } from "./Sortable";
import data from "../data/data";
import Upload from "./Upload";
import Grid from "./layouts/Grid";
import Header from "./Header";
const DraggableArea = () => {
  // set the data to the state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // checking all items are selected or not
  const [allSelect, setAllSelect] = useState(false);
  // maintaining which image is dragging
  const [activeId, setActiveId] = useState(null);
  // maintaining which image is selected
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://picsum.photos/v2/list?page=2&limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const imageData = await response.json();
        const imageUrls = imageData.map(image => image.download_url);
        setItems(imageUrls);
        setLoading(false); // Set loading to false after images are fetched
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchImages();
  }, []); // Empty dependency array to run effect only once when component mounts


  // handle the image selection and deselecting
  const handleSelect = (index) => {
    let selected = [...selectedImages];
    let unSelect = selected.indexOf(index);
    if (unSelect != -1) {
      selected.splice(unSelect, 1);
    } else {
      selected.push(index);
    }
    setSelectedImages(selected);
  };

  // delete selected images  by clicking on the delete button
  const handleDeleteImages = () => {
    const updateImages = items.filter(
      (value) => !selectedImages.includes(value)
    );
    setItems(updateImages);
    setSelectedImages([]);
  };

  const handleSelectAll = () => {
    if (allSelect) {
      setAllSelect(false);
      setSelectedImages([]);
    } else {
      setAllSelect(true);
      setSelectedImages(items);
    }
  };

  // using mouse and touch sensor for drag and drop functionality
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // handle dragstart event
  function handleDragStart(event) {
    // update active id
    setActiveId(event.active.id);
  }

  // handle dragend event
  function handleDragEnd(event) {
    const { active, over } = event;
    // update the the data after drag and drop
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    // update active id
    setActiveId(null);
  }

  // handle the drag cancel  event
  function handleDragCancel() {
    // update active id
    setActiveId(null);
  }

  return (
    <>
      {/* call the header component and pass the props */}
      <Header
        selectedImagesLength={selectedImages.length}
        handleDeleteImages={handleDeleteImages}
        handleSelectAll={handleSelectAll}
      />
      {/* DndContext is the main wrapper for the drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* SortableContext is wrapper for sortable items */}
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {/* call the grid layout for all the images */}
          <Grid>
            {/* mapping all data from items */}
            {items.map((url, index) => (
              // return Sortable component for each data and passing important props
              <Sortable
                key={url}
                url={url}
                index={index}
                selectColor={
                  selectedImages.includes(url)
                    ? "bg-[#ffffff8f] visible opacity-100"
                    : "bg-[#82828283] invisible opacity-0"
                }
                checked={selectedImages.includes(url) ? true : false}
                onChangeFun={() => handleSelect(url)}
              />
            ))}
            {/* show the upload image component */}
            <Upload length={items.length == 0 && true} />
          </Grid>
        </SortableContext>
        {/*drag overlay maintains that image which is dragging */}
        <DragOverlay adjustScale={true}>
          {activeId ? (
            <DragItem
              src={activeId}
              index={items.indexOf(activeId)}
              overlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default DraggableArea;
