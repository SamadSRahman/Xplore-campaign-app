import React, { useEffect, useState } from "react";
import {styles} from './styles.js';

const Image360Viewer = ({productId}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [colorData, setColorData] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [previousTouchX, setPreviousTouchX] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalFrames, setTotalFrames] = useState(36);



  const fetchColorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://xplr.live/api/v1/product/getOne/${productId}`);
      const data = await response.json();
      setColorData(data.data.vr_exterior);
      setSelectedColor(data.data.vr_exterior[0]);
      console.log(data.data.vr_exterior[0].vr_exterior_image[0]);
      
      setTotalFrames(data.data.vr_exterior[0].vr_exterior_image.length);
      console.log("data", data.data.vr_exterior[0].vr_exterior_image.length);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching color data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColorData();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => { 
    setTotalFrames(selectedColor?.vr_exterior_image.length);
  },[selectedColor])

  const handleColorSelect = (color) => {
    console.log("color", color);
    setSelectedColor(color);
    // setCurrentFrame(0)
  };

  const handleDrag = (e) => {
    const movementX = e.movementX || 0;
    const change = Math.sign(movementX);

    setCurrentFrame((prevFrame) => {
      let newFrame = (prevFrame + change) % totalFrames;
      return newFrame < 0 ? totalFrames - 1 : newFrame;
    });
  };

  const handleTouchStart = (e) => {
    setPreviousTouchX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const movementX = touch.clientX - previousTouchX;
    setPreviousTouchX(touch.clientX);
  
    const change = Math.sign(movementX);
    setCurrentFrame((prevFrame) => {
      let newFrame = (prevFrame + change) % totalFrames;
      return newFrame < 0 ? totalFrames - 1 : newFrame;
    });
  };

  const handleTouchEnd = () => {
    setPreviousTouchX(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
        console.log("totalFrames", totalFrames);
        
      setCurrentFrame((prev) =>{
        if(prev + 1 >= totalFrames){
          return 0;
      }else{
        return prev + 1;
      }});
    } else if (e.key === "ArrowLeft") {
      setCurrentFrame((prev) => {
        if(prev - 1 < 0)
          return totalFrames - 1
          else{
            return prev - 1;
          }
      });
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.colorSelector}>
        {colorData.map((color) => (
        //   <button
        //     key={color.color_name}
        //     onClick={() => handleColorSelect(color)}
        //     style={{
        //       ...styles.colorButton,
        //       ...(selectedColor?.color_name === color.color_name && styles.colorButtonSelected)
        //     }}
        //   >
            <div style={styles.colorButtonContent} key={color.color_name}>
              <img 
               onClick={() => handleColorSelect(color)}
                src={`${color.color_pallet_selected_file}`}
                alt={color.color_name}
                style={styles.colorImage}
              />
              {/* <span style={styles.colorName}>{color.color_name}</span> */}
            </div>
        //   </button>
        ))}
      </div>

      <div
        style={styles.viewerContainer}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onMouseDown={(e) => e.target.setPointerCapture(e.pointerId)}
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
      >
        {selectedColor && (
          <img
            src={selectedColor?.vr_exterior_image[currentFrame]?.vr_exterior_image_file}
            alt={`${selectedColor.color_name} - Frame ${currentFrame}`}
            style={styles.image}
            draggable="false"
          />
        )}
      </div>
    </div>
  );
};

export default Image360Viewer;