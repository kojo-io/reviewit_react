import React, {Component} from "react";

export class PiButton extends Component<any, any> {
    render() {
        return (
            <button type="button"
                    onClick={this.props.onClick}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">
                {this.props.children}
            </button>
        );
    }
}