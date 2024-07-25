import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import "react-resizable/css/styles.css";
import {
  CancelOutlined,
  CloseOutlined,
  DragIndicator,
  EditNote,
  UploadOutlined,
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
} from "reactstrap";
import "./editor.css";
import { TfiHandDrag } from "react-icons/tfi";
import ResizeHandle from "../../../Components/ResizeHandle";
import { useReactToPrint } from "react-to-print";
import ContextMenu from "../../../Components/ContexctMenu";
import GuideLines from "../../../Components/GuildeLines/GuildLines";
import uniqid from "uniqid";
import { addTemplate, getAllTemplate, updateTemplate } from "../../../service/idcard";
import IDcard from "../../../Components/IDCARD/IDcard";
import { toast } from "react-toastify";
import preview from "../../../assets/images/demo/user.jpeg";
import { Input, Popconfirm, Upload } from "antd";
import Styler from "../../../Components/Styler/Styler";
import { Button as AntdButton } from "antd";
import ImageUploadModal from "../../../Components/Modal/ImageUpload";
import { Modal as antdModel } from "antd";
const { confirm } = antdModel;
import { BsUpload } from "react-icons/bs";
const Editor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState([]);
  const [styles, setStyles] = useState({});
  const [templates, setTemplates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState("Horizontal");
  const [workspaceDimensions, setWorkspaceDimensions] = useState({
    width: 87,
    height: 55,
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const offcanvasRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [flag, setFlag] = useState(true);
  const [openTemplates, setOpenTemplates] = useState(false);
  const availableFields = [
    "studentname",
    "fathersname",
    "mothersname",
    "class",
    "address",
    "mobilenumber",
    "schoolname",
    "session",
    "studentidno",
    "aadhar",
    "dob",
    "section",
    "housename",
    "name",
    "husbandname",
    "email",
    "empid",
    "designation",
    "Bloodgroup",
    "other1",
    "other2",
    "other3",
    "validfrom",
    "validTill"    


  ];
  const contentToPrint = useRef(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    elementId: null,
  });
  const [guideLines, setGuideLines] = useState([]);
  const [name, setName] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmUpdate, setOpenConfirmUpdate] = useState(false);

  const [loading,setLoading] = useState(false)
  const [updateID,setUpdateId] = useState('');

  const toggleModal = () => setIsUploadOpen(!isUploadOpen);
  const toggleTemplate = () => {
    debugger;
    setOpenTemplates(!openTemplates);
  };
  function resetAll() {
    setElements([]);
    setSelectedElementId([]);
    setStyles({});
    setBackgroundImage(null);
    setName('')
  }

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });
  const toggleOff = () => {
    setIsOpen(!isOpen);
  };

  const handleRightClick = (event, elementId) => {
    debugger
    event.preventDefault();
  
    const menuWidth = 250; 
    const menuHeight = 380; 
    const padding = 10;
  
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    let x = event.clientX;
    if (x + menuWidth + padding > viewportWidth) {
      x = viewportWidth - menuWidth - padding;
    } else if (x < padding) {
      x = padding;
    }
  
    let y = event.clientY;
    if (y + menuHeight + padding > viewportHeight) {
      y = viewportHeight - menuHeight - padding;
    } else if (y < padding) {
      y = padding;
    }
  
    setContextMenu({
      visible: true,
      x,
      y,
      elementId,
    });
  };
  

  const handleContextMenuAction = (action) => {
    if (contextMenu.elementId !== null) {
      switch (action) {
        case "delete":
          removeElement(contextMenu.elementId);
          break;
        case "bringForward":
          setElements((prevElements) => {
            const newElements = [...prevElements];
            const index = newElements.findIndex(
              (el) => el.id === contextMenu.elementId
            );
            if (index >= 0) {
              newElements[index]["zIndex"] += 1;
            }
            return newElements;
          });
          break;
        case "sendBackward":
          setElements((prevElements) => {
            const newElements = [...prevElements];
            const index = newElements.findIndex(
              (el) => el.id === contextMenu.elementId
            );
            if (index >= 0) {
              newElements[index]["zIndex"] -= 1;
            }
            return newElements;
          });
          break;
        case "duplicate":
          duplicateElement(contextMenu.elementId);
          break;
        case "settings":
          const elem = [...elements];
          const index = elem.findIndex((el) => el.id === contextMenu.elementId);
          if (index >= 0) {
            setSelectedElementId(contextMenu.elementId);
            toggleOff();
            setStyles(elem[index]["styles"]);
          }
          break;
        case "alignLeft":
          alignElements("left");
          break;
        case "alignRight":
          alignElements("right");
          break;
        case "alignTop":
          alignElements("top");
          break;
        case "alignBottom":
          alignElements("bottom");
          break;
        default:
          break;
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
  };

  const alignElements = (alignment) => {
    const selectedElements = elements.filter((el) =>
      selectedElementId.includes(el.id)
    );

    debugger;
    if (selectedElements.length < 2) {
      toast.error("Please select at least 2 element.");
      return;
    }
    if (selectedElements.length > 0) {
      let referenceCoordinate;

      switch (alignment) {
        case "left":
          referenceCoordinate = Math.min(
            ...selectedElements.map((el) => el.position.x)
          );
          break;
        case "right":
          referenceCoordinate = Math.max(
            ...selectedElements.map((el) => el.position.x + el.size.width)
          );
          break;
        case "top":
          referenceCoordinate = Math.min(
            ...selectedElements.map((el) => el.position.y)
          );
          break;
        case "bottom":
          referenceCoordinate = Math.max(
            ...selectedElements.map((el) => el.position.y + el.size.height)
          );
          break;
        default:
          break;
      }

      const updatedElements = elements.map((el) => {
        if (selectedElementId.includes(el.id)) {
          const updatedPosition = { ...el.position };
          switch (alignment) {
            case "left":
              updatedPosition.x = referenceCoordinate;
              break;
            case "right":
              updatedPosition.x = referenceCoordinate - el.size.width;
              break;
            case "top":
              updatedPosition.y = referenceCoordinate;
              break;
            case "bottom":
              updatedPosition.y = referenceCoordinate - el.size.height;
              break;
            default:
              break;
          }
          return { ...el, position: updatedPosition };
        }
        return el;
      });

      setElements(updatedElements);
      setSelectedElementId([]);
      setGuideLines([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible && !event.target.closest(".context-menu")) {
        setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (layout === "Horizontal") {
      setWorkspaceDimensions({ width: 87, height: 55 });
    } else {
      setWorkspaceDimensions({ width: 55, height: 87 });
    }
  }, [layout]);

  const addElement = (type, imgURl = "") => {
    const newElement = {
      id: uniqid(),
      type,
      content:
        type === "label"
          ? "Label Element"
          : type === "input"
          ? "Input Element"
          : type === "image"
          ? preview
          : "",
      position: { x: 0, y: 0 },
      imgURl: imgURl,
      size: {
        width: type === "image" ? 50 : 100,
        height: type === "image" ? 50 : 10,
      },
      parentStyle: {},
      styles: { fontSize: "10px", whiteSpace: "nowrap", textTransform: "none",ObjectFit: "contain" },
      zIndex: elements.length,
      fieldMapping: "",
    };
    setElements([...elements, newElement]);
  };

  const duplicateElement = (id) => {
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uniqid(), // Generate new id
        position: {
          x: elementToDuplicate.position.x + 10,
          y: elementToDuplicate.position.y + 10,
        }, // Offset position
        zIndex: elements.length,
      };
      setElements([...elements, newElement]);
    }
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId([]);
      setStyles({});
    }
  };

  const handleDrag =
    (index) =>
    (e, { x, y }) => {
      debugger;
      const newElements = [...elements];
      const draggedElement = { ...newElements[index], position: { x, y } };
      const snapPosition = calculateGuideLines(draggedElement, "drag");

      newElements[index].position = snapPosition.position;
      setGuideLines(snapPosition.lines);
      setElements(newElements);
    };

  const handleStop = () => {
    setGuideLines([]);
  };

  const MAGNETIC_THRESHOLD = 5;

  const calculateGuideLines = (element, type) => {
    const lines = [];
    let snapPosition = { x: element.position.x, y: element.position.y };
    let snapSize = { width: element.size.width, height: element.size.height };

    elements.forEach((el) => {
      if (el.id !== element.id) {
        if (type === "drag") {
          if (
            Math.abs(el.position.y - element.position.y) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "horizontal",
              position: el.position.y,
              start: Math.min(el.position.x, element.position.x),
              end: Math.max(
                el.position.x + el.size.width,
                element.position.x + element.size.width
              ),
            });
            snapPosition.y = el.position.y;
          }
          if (
            Math.abs(
              el.position.y +
                el.size.height -
                (element.position.y + element.size.height)
            ) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "horizontal",
              position: el.position.y + el.size.height,
              start: Math.min(el.position.x, element.position.x),
              end: Math.max(
                el.position.x + el.size.width,
                element.position.x + element.size.width
              ),
            });
            snapPosition.y =
              el.position.y + el.size.height - element.size.height;
          }
          if (
            Math.abs(el.position.x - element.position.x) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "vertical",
              position: el.position.x,
              start: Math.min(el.position.y, element.position.y),
              end: Math.max(
                el.position.y + el.size.height,
                element.position.y + element.size.height
              ),
            });
            snapPosition.x = el.position.x;
          }
          if (
            Math.abs(
              el.position.x +
                el.size.width -
                (element.position.x + element.size.width)
            ) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "vertical",
              position: el.position.x + el.size.width,
              start: Math.min(el.position.y, element.position.y),
              end: Math.max(
                el.position.y + el.size.height,
                element.position.y + element.size.height
              ),
            });
            snapPosition.x = el.position.x + el.size.width - element.size.width;
          }
        } else if (type === "resize") {
          if (
            Math.abs(el.size.height - element.size.height) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "horizontal",
              position: element.position.y + element.size.height,
              start: Math.min(el.position.x, element.position.x),
              end: Math.max(
                el.position.x + el.size.width,
                element.position.x + element.size.width
              ),
            });
            snapSize.height = el.size.height;
          }
          if (
            Math.abs(el.size.width - element.size.width) < MAGNETIC_THRESHOLD
          ) {
            lines.push({
              type: "vertical",
              position: element.position.x + element.size.width,
              start: Math.min(el.position.y, element.position.y),
              end: Math.max(
                el.position.y + el.size.height,
                element.position.y + element.size.height
              ),
            });
            snapSize.width = el.size.width;
          }
        }
      }
    });

    if (type === "drag") {
      return { position: snapPosition, lines };
    } else if (type === "resize") {
      return { size: snapSize, lines };
    }
  };

  const handleResizeStop = () => {
    setGuideLines([]);
  };

  const handleResize = (index) => (e, direction, ref, d) => {
    debugger;
    const newElements = [...elements];
    const resizedElement = {
      ...newElements[index],
      size: {
        width: Number(newElements[index].size.width) + d.width,
        height: Number(newElements[index].size.height) + d.height,
      },
    };
    const snapSize = calculateGuideLines(resizedElement, "resize");

    newElements[index].size = snapSize.size;

    setGuideLines(snapSize.lines);
    setElements(newElements);
  };

  const handleStyleChange = (property, value) => {
    debugger;
    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return {
          ...el,
          styles: {
            ...el.styles,
            [property]: value,
          },
        };
      }
      return el;
    });

    setElements(newElements);
    setStyles((prevStyles) => ({
      ...prevStyles,
      [property]: value,
    }));
  };


  const handleParentStyleChange = (property, value) => {
    debugger;
    if (value == "-px" || !value || value == "px") {
      value = 0;
    } else {
      value = parseInt(value.replace("px", ""));
    }

    const newElements = elements.map((el) => {
      debugger;
      if (el.id === selectedElementId) {
        let xaxis = el.position.x;
        let yaxis = el.position.y;

        // Calculate new positions based on the property
        switch (property) {
          case "marginLeft":
            xaxis += value;
            break;
          case "marginRight":
            xaxis -= value;
            break;
          case "marginTop":
            yaxis += value;
            break;
          case "marginBottom":
            yaxis -= value;
            break;

          default:
            break;
        }

        return {
          ...el,
          parentStyle: {
            ...el.parentStyle,
            [property]: value,
          },
          position: { x: xaxis, y: yaxis },
        };
      }
      return el;
    });

    setElements(newElements);

    setStyles((prevStyles) => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  const handleContentChange = (content) => {
    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, content };
      }
      return el;
    });
    setElements(newElements);
  };

  const handleSizeChange = (size) => {
    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, size };
      }
      return el;
    });
    setElements(newElements);
  };

  const handleFieldMappingChange = (fieldMapping) => {
    debugger;
    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, fieldMapping, content: fieldMapping };
      }
      return el;
    });
    setElements(newElements);
  };

  

  const saveTemplate = async () => {
    const templateData = {
      elements: elements.map((el) => ({ ...el })),
      layout,
      backgroundImage,
      styles,
      name,
    };

    try {
      setLoading(true)
      const response = await addTemplate(templateData);
      setUpdateId('')
      setOpenConfirm(false);
      setOpenConfirmUpdate(false);
      resetAll();

      toast.success("Template saved successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error:", error);
    } finally{
      setLoading(false)

    }
  };


  const editTemplate = async () => {
    const templateData = {
      elements: elements.map((el) => ({ ...el })),
      layout,
      backgroundImage,
      styles,
      id: updateID
    };

    try {
      setLoading(true)
      const response = await updateTemplate(templateData);
      setUpdateId('')
      setOpenConfirm(false);
      setOpenConfirmUpdate(false);
      resetAll();

      toast.success("Template updated successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error:", error);
    } finally{
      setLoading(false)

    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await getAllTemplate();
      const data = await response;
      setTemplates(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadTemplate = (templateId) => {
    debugger
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setUpdateId(templateId);
      setElements(template.elements);
      setStyles(template.styles)
      setLayout(template.layout);
      setBackgroundImage(template.backgroundImage);
      setOpenTemplates(false);
    }
  };


  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleKeyDown = (event) => {
    if (selectedElementId.length > 0) {
      const step = 1;
      let direction = { x: 0, y: 0 };
      switch (event.key) {
        case "ArrowUp":
          direction.y = -step;
          break;
        case "ArrowDown":
          direction.y = step;
          break;
        case "ArrowLeft":
          direction.x = -step;
          break;
        case "ArrowRight":
          direction.x = step;
          break;
        default:
          return;
      }

      setElements((prevElements) =>
        prevElements.map((el) => {
          if (selectedElementId.includes(el.id)) {
            return {
              ...el,
              position: {
                x: el.position.x + direction.x,
                y: el.position.y + direction.y,
              },
            };
          }
          return el;
        })
      );
    }
  };

  const handleMarginAdjust = (type, val) => {
    if (selectedElementId.length > 0) {
      let direction = { x: 0, y: 0 };
      switch (type) {
        case "top":
          direction.y += val;
          break;
        case "bottom":
          direction.y -= val;
          break;
        case "left":
          direction.x += val;
          break;
        case "right":
          direction.x -= val;
          break;
        default:
          return;
      }

      setElements((prevElements) =>
        prevElements.map((el) => {
          if (selectedElementId.includes(el.id)) {
            return {
              ...el,
              position: {
                x: el.position.x + direction.x,
                y: el.position.y + direction.y,
              },
            };
          }
          return el;
        })
      );
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId]);

  return (
    <>
      <div className="App h-100 w-100 d-flex align-items-center">
        <div className="main mb-5" style={{ width: "25%" }}>
          <div className="layout mb-5 d-flex flex-column">
            <label htmlFor="">Select Layout</label>
            <ButtonGroup>
              <Button
                className="button-17"
                active={layout === "Horizontal"}
                outline
                onClick={() => setLayout("Horizontal")}
              >
                Horizontal
              </Button>
              <Button
                className="button-17"
                active={layout === "Vertical"}
                outline
                onClick={() => setLayout("Vertical")}
              >
                Vertical
              </Button>
            </ButtonGroup>
          </div>
          <div className="toolbar">
            <button className="button-17" onClick={() => addElement("label")}>
              Add Label
            </button>
            <button className="button-17" onClick={() => addElement("input")}>
              Add Field
            </button>
            <button className="button-17" onClick={() => addElement("image")}>
              Add Image
            </button>
            {/*<button className='button-17' onClick={() => addElement('box')}>Add Box</button> */}
            <button className="button-17" onClick={() => resetAll()}>
              Clear All
            </button>
            <button className="button-17 " onClick={toggleModal}>
              <BsUpload size={25} className="mr-5" /> <span>Upload Assets</span>
            </button>

            <button className="button-17" onClick={togglePreview}>
              Preview
            </button>
          </div>
          <Container className="col-md-12 mt-5">
          <FormGroup className="mb-5" >
            <Label for="formFile" className="form-label">
              Upload Design
            </Label>
            <div className="d-flex align-items-center gap-2">
              <Input
              style={{height: '52px'}}
                type="file"
                id="formFile"
                onChange={handleBackgroundImageChange}
              />
              <CancelOutlined
                onClick={() => setBackgroundImage(null)}
                size={25}
              />
            </div>
          </FormGroup>
        </Container>
          <div className="row mt-5 ">
           {!updateID ? <div className="col-md-12">
              <Popconfirm
                title="Enter template Name."
                description=<Input onChange={(e) => setName(e.target.value)} />
                open={openConfirm}
                onConfirm={saveTemplate}
                okButtonProps={{
                  loading: loading,
                }}
                onCancel={()=> setOpenConfirm(false)}
              >
                <button
                  className="button-17 w-100 d-flex gap-2"
                  onClick={()=> setOpenConfirm(true)}
                >
                  Save Template
                </button>
              </Popconfirm>
            </div> :<div className="col-md-12">
            <Popconfirm
              title="Are you sure want to save."
              open={openConfirmUpdate}
              onConfirm={editTemplate}
              okButtonProps={{
                loading: loading,
              }}
              onCancel={()=> setOpenConfirmUpdate(false)}
            >
              <button
                className="button-17 w-100 d-flex gap-2"
                onClick={()=> setOpenConfirmUpdate(true)}
              >
                Update Template
              </button>
            </Popconfirm>
          </div>}
          </div>
         
          <div className="row mt-5 ">
            <div className="col-md-12">
              <button
                className="button-17 w-100 d-flex gap-2"
                onClick={toggleTemplate}
              >
                <EditNote size={25} className="mr-5" />{" "}
                <span>Previous IDCARD</span>
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "75%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            transition: "margin-right 0.3s ease",
            marginRight: isOpen ? "20%" : "0",
          }}
        >
          <div
            className="workspace"
            onClick={() => setSelectedElementId([])}
            style={{
              scale: "2",
              width: `${workspaceDimensions.width}mm`,
              height: `${workspaceDimensions.height}mm`,
              position: "relative",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              margin: "0 auto",
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {elements.map((el, index) => (
              <Draggable
                key={el.id}
                position={el.position}
                onStop={handleStop}
                onDrag={handleDrag(index)}
                bounds="parent"
                grid={[1, 1]}
                handle=".drag-handle"
              >
                <Resizable
                  onMouseDownCapture={() => {
                    setFlag(true);
                  }}
                  onMouseUpCapture={() => {
                    setFlag(false);
                  }}
                  axis="both"
                  size={{ width: el.size.width, height: el.size.height }}
                  onResizeStart={handleStop}
                  onResizeStop={handleResize(index)}
                  minWidth={5}
                  minHeight={10}
                  bounds={"parent"}
                  grid={[1, 1]}
                  style={{
                    position: "absolute",
                    border: "1px solid #ddd",
                    zIndex: el.zIndex,
                    ...el.parentStyle,
                  }}
                  handleStyles={{
                    top: {
                      marginTop: -1,
                      marginLeft: -9,
                      top: 0,
                      left: "50%",
                      cursor: "ns-resize",
                      border: "3px solid #999",
                      borderLeft: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      borderWidth: 1,
                      borderColor: "#4d4d4d",
                      width: 10,
                      height: 10,
                      boxSizing: "border-box",
                      zIndex: 1,
                    },
                    left: {
                      marginTop: -4,
                      marginLeft: -1,
                      top: "50%",
                      left: 0,
                      cursor: "ew-resize",
                      border: "3px solid #999",
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      borderWidth: 1,
                      borderColor: "#4d4d4d",
                      width: 10,
                      height: 10,
                      boxSizing: "border-box",
                      zIndex: 1,
                    },
                    bottom: {
                      marginTop: -9,
                      marginLeft: -9,
                      top: "100%",
                      left: "50%",
                      cursor: "ns-resize",
                      border: "3px solid #999",
                      borderLeft: "none",
                      borderRight: "none",
                      borderTop: "none",
                      borderWidth: 1,
                      borderColor: "#4d4d4d",
                      width: 10,
                      height: 10,
                      boxSizing: "border-box",
                      zIndex: 1,
                    },
                    right: {
                      marginTop: -4,
                      marginLeft: -9,
                      top: "50%",
                      left: "100%",
                      cursor: "ew-resize",
                      border: "3px solid #999",
                      borderTop: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderWidth: 1,
                      borderColor: "#4d4d4d",
                      width: 10,
                      height: 10,
                      boxSizing: "border-box",
                      zIndex: 1,
                    },
                  }}
                  handleComponent={{
                    topLeft: <ResizeHandle />,
                    topRight: <ResizeHandle />,
                    bottomLeft: <ResizeHandle />,
                    bottomRight: <ResizeHandle />,
                  }}
                  enable={{
                    top: selectedElementId?.includes(el.id) ? true : false,
                    right: selectedElementId?.includes(el.id) ? true : false,
                    bottom: selectedElementId?.includes(el.id) ? true : false,
                    left: selectedElementId?.includes(el.id) ? true : false,
                    topRight: selectedElementId?.includes(el.id) ? true : false,
                    bottomRight: selectedElementId?.includes(el.id)
                      ? true
                      : false,
                    bottomLeft: selectedElementId?.includes(el.id)
                      ? true
                      : false,
                    topLeft: selectedElementId?.includes(el.id) ? true : false,
                  }}
                  onContextMenu={(e) => handleRightClick(e, el.id)}
                >
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      const idToAdd = el.id;
                      if (event.shiftKey) {
                        setSelectedElementId((prev) => [...prev, idToAdd]);
                      } else {
                        setSelectedElementId([idToAdd]);
                      }
                    }}
                    className={`element ${el.type}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: `${ el.type === "image" ? "" :  "hidden"}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedElementId?.includes(el.id) && (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        className="drag-handle"
                        style={{
                          cursor: "move",
                          position: "absolute",
                          bottom: "-20px",
                          right: "50%",
                        }}
                      >
                        <TfiHandDrag style={{ zIndex: 999 }} />
                      </div>
                    )}
                    {el.type === "label" && (
                      <div
                        style={{ ...el.styles, width: "100%", height: "100%" }}
                      >
                        {el.content}
                      </div>
                    )}
                    {el.type === "input" && (
                      <div
                        style={{ ...el.styles, width: "100%", height: "100%" }}
                      >
                        {el.content}
                      </div>
                    )}
                    {el.type === "image" && (
                      <img
                        src={el.imgURl ? el.imgURl : preview}
                        alt="img"
                        style={{ ...el.styles, width: "100%", height: "100%"}}
                      />
                    )}
                    {el.type === "box" && (
                      <div
                        style={{ ...el.styles, width: "100%", height: "100%" }}
                      ></div>
                    )}
                  </div>
                </Resizable>
              </Draggable>
            ))}
            <GuideLines
              lines={guideLines}
              containerSize={workspaceDimensions}
            />
          </div>
        </div>

        {selectedElementId !== null && (
          <Offcanvas
            isOpen={isOpen}
            toggle={toggleOff}
            backdrop={true}
            direction="end"
            style={{ width: "22%" }}
            ref={offcanvasRef}
          >
            <OffcanvasHeader toggle={toggleOff}>
              <h3>Style Settings</h3>
            </OffcanvasHeader>
            <OffcanvasBody>
              <Styler
                styles={styles}
                handleStyleChange={handleStyleChange}
                handleParentStyleChange={handleParentStyleChange}
                elements={elements}
                selectedElementId={selectedElementId}
                handleContentChange={handleContentChange}
                availableFields={availableFields}
                handleFieldMappingChange={handleFieldMappingChange}
                handleMarginAdjust={handleMarginAdjust}
                handleSizeChange={handleSizeChange}
              />
            </OffcanvasBody>
          </Offcanvas>
        )}
      </div>

      <Modal isOpen={isPreviewOpen} toggle={togglePreview} size="lg">
        <ModalHeader toggle={togglePreview}>ID Card Preview </ModalHeader>
        <ModalBody
          ref={contentToPrint}
          style={{
            height: "700px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              scale: "2",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          >
            <IDcard
              size={
                layout == "Vertical"
                  ? { width: 55, height: 87 }
                  : { width: 87, height: 55 }
              }
              elements={elements}
              backgroundImage={backgroundImage}
              layout={layout}
              isPreview={true}
            />
          </div>
        </ModalBody>
      </Modal>
      

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => handleContextMenuAction("delete")}
          onBringForward={() => handleContextMenuAction("bringForward")}
          onSendBackward={() => handleContextMenuAction("sendBackward")}
          onDuplicate={() => handleContextMenuAction("duplicate")}
          onSettings={() => handleContextMenuAction("settings")}
          onAlignLeft={() => handleContextMenuAction("alignLeft")}
          onAlignRight={() => handleContextMenuAction("alignRight")}
          onAlignTop={() => handleContextMenuAction("alignTop")}
          onAlignBottom={() => handleContextMenuAction("alignBottom")}
        />
      )}

      {isUploadOpen && (
        <ImageUploadModal
          addElement={addElement}
          isOpen={isUploadOpen}
          toggle={toggleModal}
        />
      )}

      <div>
        <Modal
          size={"xl"}
          isOpen={openTemplates}
          toggle={toggleTemplate}
          title="Select IDCARD"
        >
          <ModalHeader toggle={toggleTemplate}>Upload Images</ModalHeader>

          <Container>
            <Row>
              {templates.map((template) => (
                <Col lg={4} md={4}>
                  <div
                    onClick={() => loadTemplate(template.id)}
                    style={{ scale: "0.7"}}
                  >
                    <IDcard
                      size={
                        template.layout == "Vertical"
                          ? { width: 55, height: 87 }
                          : { width: 87, height: 55 }
                      }
                      backgroundImage={template.backgroundImage}
                      elements={template.elements}
                      isPreview={true}
                    />
                    <div className="text-center" style={{ fontSize: "25px" }}>
                      {template.name}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </Modal>
      </div>
    </>
  );
};

export default Editor;
