import React from "react";
import "./styler.css";
import { Select } from "antd";
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
            Color
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

        <div className="d-flex justify-content-between align-items-center col-md-12 mb-1">
          <label
            className="form-label mb-0"
            style={{ width: "50%", fontSize: "15px" }}
          >
            Field Mapping
          </label>

          {elements.find((el) => el.id === selectedElementId).type ===
            "input" && (
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
          )}
        </div>

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
            type="number"
            value={
              parseInt(element.parentStyle["marginLeft"]?.replace("px", "")) ||
              0
            }
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
            type="number"
            value={
              parseInt(element.parentStyle["marginRight"]?.replace("px", "")) ||
              0
            }
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
            type="number"
            value={
              parseInt(element.parentStyle["marginTop"]?.replace("px", "")) || 0
            }
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
            type="number"
            value={
              parseInt(
                element.parentStyle["marginBottom"]?.replace("px", "")
              ) || 0
            }
            onChange={(e) =>
              handleParentStyleChange("marginBottom", `${e.target.value}px`)
            }
          />
        </div>

        <div class="col-md-12">
          <label class="form-element-label headinglabel">Border</label>
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
