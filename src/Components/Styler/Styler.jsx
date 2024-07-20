import React from "react";
import "./styler.css";
import { Select } from "antd";
import { TfiItalic } from "react-icons/tfi";
import { FormatBoldOutlined } from "@mui/icons-material";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
import FormatOverlineOutlinedIcon from "@mui/icons-material/FormatOverlineOutlined";
const { Option } = Select;
const Styler = ({
  styles,
  handleStyleChange,
  elements,
  selectedElementId,
  handleContentChange,
  handleParentStyleChange,
  availableFields,
  handleFieldMappingChange,
  handleSizeChange
}) => {
  const styleOptions = [
    { label: "Background Color", property: "backgroundColor", type: "color" },
    { label: "Font Size", property: "fontSize", type: "number" },
    { label: "Text Color", property: "color", type: "color" },
    { label: "Margin", property: "margin", type: "number" },
    { label: "Border Radius", property: "borderRadius", type: "number" },
    { label: "Border Type", property: "borderStyle", type: "dropdown" },
    { label: "Border Width", property: "borderWidth", type: "borderWidth" },
    { label: "border Color", property: "borderColor", type: "color" },
  ];
  debugger;
  const element = elements.find((t) => t.id === selectedElementId);

  function handleFormatClick(type,val) {
    debugger
      if(element.styles[type]){
        handleStyleChange(type,"")
      }else{
        handleStyleChange(type,val)
      }
  }

  return (
    <>
      <div className="style-panel row">
        <div class="col-md-12">
          <label class="form-element-label headinglabel">Normal Settings</label>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Background Color
          </label>

          <input
            style={{ width: "35%" }}
            type="color"
            value={styles["backgroundColor"] || "#fff"}
            onChange={(e) =>
              handleStyleChange("backgroundColor", `${e.target.value}`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text-Color
          </label>
          <input
            style={{ width: "35%" }}
            type="color"
            value={styles["color"] || ""}
            onChange={(e) => handleStyleChange("color", `${e.target.value}`)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Font-Size
          </label>

          <input
            style={{ width: "35%" }}
            type="text"
            value={ element.styles["fontSize"]?.replace("px", "")}
            onChange={(e) =>
              handleStyleChange("fontSize", `${e.target.value}px`)
            }
          />
        </div>
        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
        <label className="form-label mb-0" style={{ width: "40%", fontSize: "15px" }}>Font Family</label>
        <Select
          style={{ width: 120 }}
          onChange={(val) => handleStyleChange("fontFamily", `${val}`)}
          value={styles["fontFamily"]}
        >
          <Option value="Arial, sans-serif">Arial</Option>
          <Option value="Helvetica, sans-serif">Helvetica</Option>
          <Option value="Times New Roman, serif">Times New Roman</Option>
          <Option value="Georgia, serif">Georgia</Option>
          <Option value="Verdana, sans-serif">Verdana</Option>
          <Option value="Tahoma, sans-serif">Tahoma</Option>
          <Option value="Trebuchet MS, sans-serif">Trebuchet MS</Option>
          <Option value="Lucida Sans Unicode, sans-serif">Lucida Sans Unicode</Option>
          <Option value="Courier New, monospace">Courier New</Option>
          <Option value="Consolas, monospace">Consolas</Option>
          <Option value="Comic Sans MS, cursive">Comic Sans MS</Option>
          <Option value="Impact, fantasy">Impact</Option>
        </Select>
      </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text Alignment
          </label>

          <Select
            defaultValue="center"
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("textAlign", `${val}`)}
            value={styles["textAlign"]}
          >
            <Option value="left">Left</Option>
            <Option value="center">Center</Option>
            <Option value="right">Right</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text Wrap
          </label>

          <Select
            defaultValue="nowrap"
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("whiteSpace", `${val}`)}
            value={styles["whiteSpace"]}
          >
            <Option value="nowrap">no-wrap</Option>
            <Option value="pre-wrap">wrap</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text-Transform
          </label>

          <Select
            defaultValue="none"
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("textTransform", `${val}`)}
            value={styles["textTransform"]}
          >
            <Option value="none">None</Option>
            <Option value="capitalize">Capitalize</Option>
            <Option value="uppercase">Uppercase</Option>
            <Option value="lowercase">Lowercase</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text-Transform
          </label>

          <Select
            defaultValue="none"
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("textTransform", `${val}`)}
            value={styles["textTransform"]}
          >
            <Option value="none">None</Option>
            <Option value="capitalize">Capitalize</Option>
            <Option value="uppercase">Uppercase</Option>
            <Option value="lowercase">Lowercase</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Text-Style
          </label>

          <div style={{ width: "40%", fontSize: "15px", cursor: "pointer" }}>
            <FormatBoldOutlined className={element.styles["fontWeight"] ? "itemFormat" : ""} onClick={()=> handleFormatClick("fontWeight","bold")} /> {" "}
            <FormatItalicOutlinedIcon className={element.styles["fontStyle"] ? "itemFormat" : ""} onClick={()=> handleFormatClick("fontStyle","italic")}  />{" "}
            <FormatUnderlinedOutlinedIcon className={element.styles["textDecoration"] == "underline" ? "itemFormat" : ""}  onClick={()=> handleFormatClick("textDecoration","underline")} />{" "}
            <FormatOverlineOutlinedIcon className={element.styles["textDecoration"] == "overline" ? "itemFormat" : ""}  onClick={()=> handleFormatClick("textDecoration","overline")}/>{" "}
            <FormatStrikethroughOutlinedIcon className={element.styles["textDecoration"] == "line-through" ? "itemFormat" : ""} onClick={()=> handleFormatClick("textDecoration","line-through")} />{" "}
          </div>
        </div>

        {elements.find((el) => el.id === selectedElementId)?.type !==
          "image" && (
          <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
            <label
              className="form-label mb-0"
              style={{ width: "35%", fontSize: "15px" }}
            >
              Text Content
            </label>
            <input
              style={{ width: "35%" }}
              type="text"
              value={
                elements.find((el) => el.id === selectedElementId)?.content ||
                ""
              }
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        )}

        {elements.find((el) => el.id === selectedElementId) &&  (
          <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
            <label
              className="form-label mb-0"
              style={{ width: "35%", fontSize: "15px" }}
            >
              Width
            </label>
            <input
              style={{ width: "35%" }}
              type="text"
              value={
                elements.find((el) => el.id === selectedElementId)?.size.width ||
                0
              }
              onChange={(e) => handleSizeChange({...elements.find((el) => el.id === selectedElementId)?.size,width: e.target.value})}
            />
          </div>
        )}

        {elements.find((el) => el.id === selectedElementId) &&  (
          <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
            <label
              className="form-label mb-0"
              style={{ width: "35%", fontSize: "15px" }}
            >
              Height
            </label>
            <input
              style={{ width: "35%" }}
              type="text"
              value={
                elements.find((el) => el.id === selectedElementId)?.size.height ||
                0
              }
              onChange={(e) => handleSizeChange({...elements.find((el) => el.id === selectedElementId)?.size,height: e.target.value})}
            />
          </div>
        )}

        {elements.find((el) => el.id === selectedElementId).type ===
          "input" && ( <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "50%", fontSize: "15px" }}
          >
            Field Mapping
          </label>

          
            <div className="style-option">
              <Select
                style={{ width: 120 }}
                value={
                  elements.find((el) => el.id === selectedElementId)
                    ?.fieldMapping || ""
                }
                onChange={(e) => handleFieldMappingChange(e)}
              >
                <Option value="">None</Option>
                {availableFields.map((field) => (
                  <Option key={field} value={field}>
                    {field}
                  </Option>
                ))}
              </Select>
            </div>
          
        </div>)}

        <div class="col-md-12">
          <label class="form-element-label headinglabel">Margins</label>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Left
          </label>
          <input
            style={{ width: "35%" }}
            type="text"
            value={
              element.parentStyle["marginLeft"]}
            onChange={(e) =>
              handleParentStyleChange("marginLeft", `${e.target.value}px`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Right
          </label>
          <input
            style={{ width: "35%" }}
            type="text"
            value={
              element.parentStyle["marginRight"]}
            onChange={(e) =>
              handleParentStyleChange("marginRight", `${e.target.value}px`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Top
          </label>
          <input
            style={{ width: "35%" }}
            type="text"
            value={
             element.parentStyle["marginTop"] }
            onChange={(e) =>
              handleParentStyleChange("marginTop", `${e.target.value}px`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Bottom
          </label>
          <input
            style={{ width: "35%" }}
            type="text"
            value={element.parentStyle["marginBottom"] }
            onChange={(e) =>
              handleParentStyleChange("marginBottom", `${e.target.value}px`)
            }
          />
        </div>
        <div class="col-md-12">
          <label class="form-element-label headinglabel">Image</label>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Shape
          </label>

          <Select
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("borderRadius", `${val}`)}
            value={styles["borderRadius"]}
          >
            <Option value="50%">Circle</Option>
            <Option value="0%">Reactangle</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Resize Mode
          </label>

          <Select
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("objectFit", `${val}`)}
            value={styles["objectFit"]}
          >
            <Option value="fill">Clip</Option>
            <Option value="contain">Stretch</Option>
            <Option value="cover">Zoom</Option>

          </Select>
        </div>

        <div class="col-md-12">
          <label class="form-element-label headinglabel">Border</label>
        </div>

        

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Border Radius
          </label>
          <input
            style={{ width: "35%" }}
            type="number"
            value={parseInt(styles["borderRadius"]?.replace("%", "")) || 0}
            onChange={(e) =>
              handleStyleChange("borderRadius", `${e.target.value}%`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Border Style
          </label>

          <Select
            style={{ width: 120 }}
            onChange={(val) => handleStyleChange("borderStyle", `${val}`)}
            defaultValue={"Select Style"}
          >
            <Option value="solid">Solid</Option>
            <Option value="dotted">Dotted</Option>
          </Select>
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Border Width
          </label>
          <input
            style={{ width: "35%" }}
            type="number"
            value={parseInt(styles["borderWidth"]?.replace("px", "")) || 0}
            onChange={(e) =>
              handleStyleChange("borderWidth", `${e.target.value}px`)
            }
          />
        </div>

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "40%", fontSize: "15px" }}
          >
            Border Color
          </label>
          <input
            style={{ width: "35%" }}
            type="color"
            value={styles["borderColor"] || ""}
            onChange={(e) =>
              handleStyleChange("borderColor", `${e.target.value}`)
            }
          />
        </div>
      </div>
    </>
  );
};

export default Styler;
