import React, { useState, useEffect } from "react";
import preview from "../../assets/images/demo/user.jpeg";
const IDcard = ({
  size,
  backgroundImage,
  elements,
  data,
  isPreview = false,
}) => {
  const [workspaceDimensions, setWorkspaceDimensions] = useState(size);

  function getClassExt(classVal,content) {
    if(content != "class"){
      return content
    }
    if (classVal == "1") {
      return classVal+"st";
    } else if (["2"].includes(classVal)) {
      return classVal+"nd";
    } else if (classVal == "3") {
      return classVal+"rd";
    } else if (classVal == "4") {
      return classVal+"rth";
    } else if (["5", "6", "7", "8", "9", "10", "11", "12"].includes(classVal)) {
      return classVal+"th";
    } else {
      return classVal;
    }
  }

  function capitalizeWords(str) {
    str = str.toLowerCase();
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  const getContent = (el) => {
    debugger;
    const isCapitalize = el.styles.textTransform == "capitalize";
    if (!isPreview) {
      if (el.fieldMapping && data[el.fieldMapping]) {
        if (isCapitalize && el.fieldMapping!="class" ) {
          return capitalizeWords(data[el.fieldMapping]);
        } else if (el.fieldMapping == "class") {
          return `${getClassExt(
            data[el.fieldMapping],
          el.content
          )}`;
        } else {
          data[el.fieldMapping];
        }
      }
    }
    return el.content || "";
  };

  return (
    <div
      className="workspace"
      style={{
        width: `${workspaceDimensions.width}mm`,
        height: `${workspaceDimensions.height}mm`,
        position: "relative",
        margin: "0 auto",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {elements.map((el, index) => (
        <div
          key={el.id}
          style={{
            position: "absolute",
            left: `${el.position.x}px`,
            top: `${
              el.type == "input" ? parseInt(el.position.y) : el.position.y
            }px`,
            width: `${el.size.width}px`,
            height: `${el.size.height}px`,
            zIndex: el.zIndex,

            ...el.parentStyle,
          }}
        >
          {el.type === "label" && (
            <div style={{ ...el.styles, width: "100%", height: "100%" }}>
              {getContent(el)}
            </div>
          )}
          {el.type === "input" && (
            <div style={{ ...el.styles, width: "100%", height: "100%" }}>
              {getContent(el)}
            </div>
          )}
          {el.type === "image" && (
            <img
              src={el.imgURl ? el.imgURl : data?.img ? data?.img : preview}
              alt="img"
              style={{ ...el.styles, width: "100%", height: "100%" }}
            />
          )}
          {el.type === "box" && (
            <div style={{ ...el.styles, width: "100%", height: "100%" }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IDcard;
