import React from 'react';
import Popup from "reactjs-popup";
import { Trans } from "react-i18next";
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { ApplicationsStore } from '../stores/ApplicationsStore';
import { cubaREST } from '../cubaREST';

const loadButtons = (props) => {
  const { appId, buttonsInfo, saveApplicationWithProcess, onFileChange, handlePassword } = props;
  const denyButton = () => {
    return (
      <Popup
        trigger={
          <div>
            <button
              className="application-form__save"
              >
                <Trans>Deny</Trans>
            </button>
          </div>}
                      modal
                      closeOnDocumentClick
                    >
                      {(close) => (
                        <div className="modal" style={{ maxWidth: "500px" }}>
                          <div className="modal__header">
                            <h1><Trans>areUSure</Trans></h1>
                          </div>
                          <div className="modal__actions">
                            <button
                              className="confirm-button"
                              onClick={onClickDeny}
                            >
                              <Trans>Yes</Trans>
                            </button>
                            <button className="cancel-button" onClick={close}>
                              <Trans>Cancel</Trans>
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
    )
  }
  const buttonDeny = (applicationId) => {
    return cubaREST.invokeService(
        "fsr_ApplicationService",
        "endApplication",
        {
            applicationId: applicationId
            }
        )
  }
    const onClickDeny = () => {
      console.log(props);
      buttonDeny(appId)
        .then(res => {
          toast.success(i18next.t("Success"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        })
        .catch((err) => {
          toast.error("Возникла ошибка", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        });
    }
    return (
      <>
      {buttonsInfo &&
          Object.keys(buttonsInfo).length > 0 && (
            <div className="process_application-form__footer" style={{width: '100%', justifyContent: 'space-evenly'}}>
              {/*<div>*/}
              {/*  {denyButton()}*/}
              {/*</div>*/}
              {Object.entries(buttonsInfo).map(
                ([key, value] : any) =>
                  key !== "status" && key !== "saveTemp" ? (
                    <Popup
                      key={key}
                      trigger={
                        <div>
                          <button
                            key={key}
                            className="application-form__save"
                          >
                            <Trans>{key}</Trans>
                          </button>
                        </div>
                      }
                      modal
                      closeOnDocumentClick
                    >
                      {(close) => (
                        <div className="modal" style={{ maxWidth: "500px" }}>
                          <div className="modal__header">
                            <h1><Trans>AttachESP</Trans></h1>
                          </div>
                          <div className="modal__content">
                            <div className="esp__file">
                              <input
                                type="file"
                                id="file"
                                onChange={onFileChange}
                              />
                            </div>
                            <div className="esp__password">
                              <label htmlFor=""><Trans>ESPpassword</Trans></label>
                              <input
                                type="password"
                                placeholder="••••••••••"
                                onChange={handlePassword}
                              />
                            </div>
                          </div>
                          <div className="modal__actions">
                            <button
                              className="confirm-button"
                              onClick={() => {
                                  saveApplicationWithProcess(key, value.procTaskId);
                                  close();
                              }}
                            >
                              <Trans>Send</Trans>
                            </button>
                            <button className="cancel-button" onClick={close}>
                              <Trans>Cancel</Trans>
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) :
                      (
                          <div>
                              <button
                                  className="application-form__save"
                                  onClick={() => {saveApplicationWithProcess(key,value.procTaskId)}}
                                  style={{backgroundColor: key === 'saveTemp' && '#219ed9'}}
                              >
                                  <Trans>saveTemp</Trans>
                              </button>
                          </div>
                      )
              )}
            </div>
          )
        }
        {buttonsInfo &&
          Object.keys(buttonsInfo).length == 0 && (
            <div className="process_application-form__footer">
              <h2 style={{display: "flex", color: "red", justifyContent: "center", fontSize: "20px"}}>
                <Trans>YouHaveSent</Trans>
              </h2>
            </div>
          )}
      </>
    );
  };
export default loadButtons;
