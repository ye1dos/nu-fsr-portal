import * as React from "react";
// import downloadIcon from "../../assets/icons/download.svg";
import pdfIcon from "../../assets/icons/pdf-icon.svg";
import excelIcon from "../../assets/icons/excel-icon.svg";
import wordIcon from "../../assets/icons/word-icon.svg";
import fileIcon from "../../assets/icons/file-icon.svg";

import "./DocComponent.css";
import { Trans } from "react-i18next";

export interface DocComponentProps {
  id: string;
  getDoc?: any;
  getFile: any;
  fileType: string;
  name: string;
}

export interface DocComponentState {}

class DocComponent extends React.Component<
  DocComponentProps,
  DocComponentState
> {
  mounted;

  state = {
    source: null,
    docName: null,
    extension: null
  };

  fetchFile = (id, fileType) => {
    let f = async () => {
      let doc, file;

      try {
        doc = await this.props.getDoc(id);
      } catch (err) {
        console.log(err);
      }
      let extension;
      if (fileType === "document" && doc.file) {
        extension = doc.file.extension;
        try {
          file = await this.props.getFile(doc.file.id);
        } catch (error) {}
      } else if (fileType === "attachment" && doc.attachment) {
        extension = doc.attachment.extension;
        try {
          file = await this.props.getFile(doc.attachment.id);
        } catch (error) {}
      }

      this.setState({ extension });

      if (file) this.saveFile(file, doc.name);
    };

    return f();
  };

  saveFile = (file, name) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      var base64data = reader.result;
      if (this.mounted) {
        this.setState({ source: base64data, docName: name });
      }
    };
  };

  componentDidMount = () => {
    this.mounted = true;
    const { id, fileType } = this.props;

    this.fetchFile(id, fileType);
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  render() {
    const { source, docName, extension } = this.state;
    const { name } = this.props;
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

    return (
      <div className="doc__container">
        <a href={source} download={docName}>
          <img src={icon} alt="" className="doc__icon" />
        </a>

        <a className="doc__item" download={docName} href={source}>
          {name}
        </a>
      </div>
    );
  }

  renderType(type) {
    if (type) {
      return (
        <div className="file__item">
          <p><Trans>DocType</Trans></p>
          <p>{type}</p>
        </div>
      );
    }
  }

  renderOwner(owner) {
    if (owner) {
      return (
        <div className="file__item">
          <p>Владелец</p>
          <p>{owner}</p>
        </div>
      );
    }
  }
}

export default DocComponent;
