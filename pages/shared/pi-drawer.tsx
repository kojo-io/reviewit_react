import {Component} from "react";
import ReactDOM from "react-dom";
import 'primeicons/primeicons.css';
export class PiDrawer extends Component<any, any>{
    render() {
        return (
            <>
                {ReactDOM.createPortal(<BackDrop onClose={this.props.onClose}/>, document.body)}
                {ReactDOM.createPortal(<Drawer position={this.props.position} width={this.props.width} title={this.props.title} onClose={this.props.onClose}>{this.props.children}</Drawer>, document.body)}
            </>
        );
    }
}

const BackDrop = (props: any) => {
    return <div onClick={props.onClose} className="backdrop-blur-[6px] bg-gray-400/30 fixed inset-0"></div>
}

const Drawer = (props: any) => {
  return (
      <div className={`modal fixed top-0 bottom-0 z-999999999999999999999 ${props.position === 'left' && 'left-0'} ${props.position === 'right' && 'right-0'}`}>
          <div style={{width: props.width ? `${props.width}px` : '400px'}} className={`flex h-screen modal-content ${props.position === 'left' && 'justify-start'} ${props.position === 'right' && 'justify-end'}`}>
              <div className={`bg-white dark:bg-gray-800 overflow-auto h-screen w-full`}>
                  <div className="flex flex-col w-full h-full divide-y dark:divide-gray-800">
                      <div className="h-auto p-4 w-full flex justify-between space-x-4">
                          <div className="flex flex-wrap content-center h-full">
                              <label className="text-base font-bold cursor-pointer ">
                                  {props.title}
                              </label>
                          </div>
                          <div className="flex flex-col">
                              <div className="flex flex-wrap content-center h-full">
                                  <i className="pi pi-times text-lg hover:cursor-pointer" onClick={props.onClose}></i>
                              </div>
                          </div>
                      </div>
                      <div className="p-5 h-full w-full grow overflow-auto">
                          {props.children}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}