import * as React from "react";
import downloadIcon from "../../assets/icons/download.svg";
import pdfIcon from "../../assets/icons/pdf-icon.svg";
import excelIcon from "../../assets/icons/excel-icon.svg";
import wordIcon from "../../assets/icons/word-icon.svg";
import fileIcon from "../../assets/icons/file-icon.svg";

export interface FileComponentProps {
  getFile;
  id;
  name;
  extension;
  withFileIcon?;
  withDownloadIcon?;
}

export interface FileComponentState {}

class FileComponent extends React.Component<
  FileComponentProps,
  FileComponentState
> {
  mounted;
  state = {
    source: null,
  };

  public static defaultProps = {
    withFileIcon: false,
    withDownloadIcon: false,
  };

  fetchFile = () => {
    const { getFile, id } = this.props;
    let f = async () => {
      let file;

      try {
        file = await this.props.getFile(id);
        console.log(file)
        this.saveFile(file);
      } catch (error) {
          console.log(error);
      }
    };

    return f();
  };

  saveFile = (file) => {
      console.log("save")
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      var base64data = reader.result;
      if (this.mounted) {
        this.setState({ source: base64data });
      }
    };
  };

  componentDidMount = () => {
    this.mounted = true;
    this.fetchFile();
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  render() {
    const { source } = this.state;
    const { name, extension, withFileIcon, withDownloadIcon } = this.props;
    let icon;
    switch (extension) {
      case "pdf":
        icon = pdfIcon;
        break;
      case "xlsx":
        icon = excelIcon;
        break;
      case "docx":
        icon = wordIcon;
        break;
      default:
        icon = fileIcon;
        break;
    }
    if (withFileIcon && withDownloadIcon) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href={source} download={name}>
            <img src={icon} alt="" />
          </a>

          <a
            download={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              textDecoration: "none",
              color: "#0054A6",
              marginLeft: "11px",
              marginRight: "126px",
            }}
            href={source}
          >
            {name}
          </a>
          <a download={name} href={source}>
            <img src={downloadIcon} alt="" />
          </a>
        </div>
      );
    } else if (withDownloadIcon) {
      return (
        <a
          download={name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            textDecoration: "none",
            color: "#0054A6",
          }}
          href={source}
        >
          {name}
          <span>
            <img src={downloadIcon} alt="" />
          </span>
        </a>
      );
    } else if (withFileIcon) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href={source} download={name}>
            <img src={icon} alt="" />
          </a>
          <a
            download={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              textDecoration: "none",
              color: "#0054A6",
              marginLeft: "11px",
              marginRight: "126px",
            }}
            href={source}
          >
            {name}
          </a>
        </div>
      );
    } else {
      return (
        <a
          download={name}
          style={{
            display: "flex",
            textDecoration: "none",
            color: "#0054A6",
          }}
          href={source}
        >
          {name}
        </a>
      );
    }
  }
}

export default FileComponent;
