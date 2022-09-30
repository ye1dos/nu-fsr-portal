import * as React from "react";
import { toJS } from "mobx";
import { Trans } from "react-i18next";

export interface PhotoComponentProps {
  getFile;
  photo?;
  openAvatarModal;
}

export interface PhotoComponentState {}

class PhotoComponent extends React.Component<
  PhotoComponentProps,
  PhotoComponentState
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
    const { getFile, photo } = this.props;
    console.log(photo.id);
    let f = async () => {
      let file;

      try {
        file = await getFile(photo.id);
        this.saveFile(file);
      } catch (error) {}
    };

    return f();
  };

  saveFile = (file) => {
    console.log(file);
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
    if (this.props.photo) {
      this.fetchFile();
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  render() {
    const { source } = this.state;
    const { openAvatarModal } = this.props;
    // console.log(toJS(this.props.photo));
    if (!source) {
      return (
        <div className="general-info__avatar" onClick={openAvatarModal}>
          <div>
            <p style={{ marginBottom: "13px" }}>3 x 4</p>
            <p><Trans>Photo</Trans></p>
          </div>
        </div>
      );
    }
    return (
      <img
        src={source}
        className="general-info__avatar"
        onClick={openAvatarModal}
      />
    );
  }
}

export default PhotoComponent;
