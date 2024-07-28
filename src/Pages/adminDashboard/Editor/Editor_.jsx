import React, { useCallback, useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { Button, ButtonGroup, Col, Container, FormGroup, Label, Modal, ModalBody, ModalHeader, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from "reactstrap";
import { Input, Popconfirm, Upload, Modal as antdModel, Button as AntdButton } from "antd";
import { CancelOutlined, CloseOutlined, DragIndicator, EditNote, UploadOutlined } from "@mui/icons-material";
import { TfiHandDrag } from "react-icons/tfi";
import { BsUpload } from "react-icons/bs";
import uniqid from "uniqid";
import { useReactToPrint } from "react-to-print";
import preview from "../../../assets/images/demo/user.jpeg";
import GuideLines from "../../../Components/GuildeLines/GuildLines";
import ContextMenu from "../../../Components/ContexctMenu";
import Styler from "../../../Components/Styler/Styler";
import ImageUploadModal from "../../../Components/Modal/ImageUpload";
import { addTemplate, getAllTemplate, updateTemplate } from "../../../service/idcard";
import IDcard from "../../../Components/IDCARD/IDcard";
import { toast } from "react-toastify";
import "./editor.css";

const { confirm } = antdModel;

const Editor_ = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [styles, setStyles] = useState({});
  const [templates, setTemplates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState("Horizontal");
  const [workspaceDimensions, setWorkspaceDimensions] = useState({ width: 87, height: 55 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const offcanvasRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [flag, setFlag] = useState(true);
  const [openTemplates, setOpenTemplates] = useState(false);
  const availableFields = [
    "studentname", "fathersname", "mothersname", "class", "address", "mobilenumber", "schoolname", "session", "studentidno", "aadhar", "dob", "section", "housename", "name", "husbandname", "email", "empid", "designation", "Bloodgroup", "other1", "other2", "other3", "validfrom", "validTill",
  ];
  const contentToPrint = useRef(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null });
  const [guideLines, setGuideLines] = useState([]);
  const [name, setName] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmUpdate, setOpenConfirmUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateID, setUpdateId] = useState("");
  const isDragged = useRef(false);

  const toggleModal = () => setIsUploadOpen(!isUploadOpen);
  const toggleTemplate = () => setOpenTemplates(!openTemplates);
  const resetAll = () => {
    setElements([]);
    setSelectedElementId([]);
    setStyles({});
    setBackgroundImage(null);
    setName("");
  };

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const toggleOff = () => setIsOpen(!isOpen);

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
      position: { left: 0, top: 0 },
      imgURl: imgURl,
      size: {
        width: type === "image" ? 50 : 100,
        height: type === "image" ? 50 : 10,
      },
      parentStyle: {},
      styles: {
        fontSize: "10px",
        whiteSpace: "nowrap",
        textTransform: "none",
        ObjectFit: "contain",
      },
      zIndex: elements.length,
      fieldMapping: "",
      rotate: 0,
    };
    setElements([...elements, newElement]);
  };

  const handleDrag = ({ target, left, top }) => {
    const id = target.getAttribute("data-id");
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, position: { left, top } } : el
      )
    );
  };

  const handleResize = ({ target, width, height }) => {
    const id = target.getAttribute("data-id");
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, size: { width, height } } : el
      )
    );
  };

  const handleRotate = ({ target, beforeRotate }) => {
    const id = target.getAttribute("data-id");
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, rotate: beforeRotate } : el
      )
    );
  };

  const handleClick = (id) => {
    setSelectedElementId(id);
  };

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
            <button className="button-17" onClick={() => resetAll()}>
              Clear All
            </button>
            <button className="button-17">
              <BsUpload size={25} className="mr-5" /> <span>Upload Assets</span>
            </button>
            <button className="button-17">
              Preview
            </button>
          </div>
          <Container className="col-md-12 mt-5">
            <FormGroup className="mb-5">
              <Label for="formFile" className="form-label">
                Upload Design
              </Label>
              <div className="d-flex align-items-center gap-2">
                <Input style={{ height: "52px" }} type="file" id="formFile" />
                <CancelOutlined onClick={() => setBackgroundImage(null)} size={25} />
              </div>
            </FormGroup>
          </Container>
          <div className="row mt-5 ">
            {!updateID ? (
              <div className="col-md-12">
                <Popconfirm
                  title="Enter template Name."
                  description=<Input onChange={(e) => setName(e.target.value)} />
                  open={openConfirm}
                  onConfirm={() => console.log("ok")}
                  okButtonProps={{
                    loading: loading,
                  }}
                  onCancel={() => setOpenConfirm(false)}
                >
                  <button
                    className="button-17 w-100 d-flex gap-2"
                    onClick={() => setOpenConfirm(true)}
                  >
                    Save Template
                  </button>
                </Popconfirm>
              </div>
            ) : (
              <div className="col-md-12">
                <Popconfirm
                  title="Are you sure want to save."
                  open={openConfirmUpdate}
                  onConfirm={() => console.log("ok")}
                  okButtonProps={{
                    loading: loading,
                  }}
                  onCancel={() => setOpenConfirmUpdate(false)}
                >
                  <button
                    className="button-17 w-100 d-flex gap-2"
                    onClick={() => setOpenConfirmUpdate(true)}
                  >
                    Update Template
                  </button>
                </Popconfirm>
              </div>
            )}
          </div>
          <div className="row mt-5 ">
            <div className="col-md-12">
              <button
                className="button-17 w-100 d-flex gap-2"
                onClick={toggleTemplate}
              >
                <EditNote size={25} className="mr-5" /> <span>Previous IDCARD</span>
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "75%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "margin-right 0.3s ease",
            marginRight: isOpen ? "20%" : "0",
          }}
        >
          <div
            className="workspace"
            style={{
              scale: "2",
              width: `${workspaceDimensions.width}mm`,
              height: `${workspaceDimensions.height}mm`,
              position: "relative",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              margin: "0 auto",
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                data-id={el.id}
                style={{
                  position: "absolute",
                  left: el.position.left,
                  top: el.position.top,
                  width: el.size.width,
                  height: el.size.height,
                  transform: `rotate(${el.rotate}deg)`,
                  ...el.styles,
                }}
                onClick={(e) => handleClick(el.id)}
              >
              
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
            ))}

            {selectedElementId && (
              <Moveable
                target={document.querySelector(`[data-id="${selectedElementId}"]`)}
                draggable={true}
                resizable={true}
                rotatable={true}
                keepRatio={false}
                
                onDrag={({ target, left, top }) => handleDrag({ target, left, top })}
                onResize={({ target, width, height }) => handleResize({ target, width, height })}
                onRotate={({ target, beforeRotate }) => handleRotate({ target, beforeRotate })}
              />
            )}

            <GuideLines lines={guideLines} containerSize={workspaceDimensions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor_;
