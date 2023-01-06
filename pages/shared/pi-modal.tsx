import ReactDOM from "react-dom";
import {PiButton} from "./pi-button";

interface Props {
    modalSize?: 'normal' | 'large' | undefined;
    fullScreen: false;
    onClose: () => void;
    children?: any;
}

export const PiModal = (props: Props) => {
    return (
        <>
            {ReactDOM.createPortal(<BackDrop onClose={props.onClose}/>, document.body)}
            {ReactDOM.createPortal(<Modal modalSize={props.modalSize} fullScreen={props.fullScreen} onClose={props.onClose}>{props.children}</Modal>, document.body)}
        </>
    );
}

const BackDrop = (props: any) => {
    return <div onClick={props.onClose} className="backdrop-blur-[6px] bg-gray-400/30 fixed inset-0"></div>
}

const Modal = (props: Props) => {
  return (
      <>
          <style jsx>
              {`
                 .modal {
                 pointer-events: none !important;
                 }
                 
                 .modal-content {
                 pointer-events: all !important;
                 }`
              }
          </style>
          <div className={'modal fixed inset-0 z-999999999999999999999'}>
              <div className="flex flex-wrap content-center h-full w-full justify-center">
                  <div className={`modal-content bg-white dark:bg-gray-800 space-y-4 p-5 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 rounded-xl`}>
                      {props.children}
                  </div>
              </div>
          </div>
      </>
  )
}