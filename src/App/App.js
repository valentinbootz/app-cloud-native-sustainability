import React from 'react';

import './App.css';

import { AppContext } from '../Context';

import Modeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import {
    getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import CustomPathMap from './CustomPathMap';
import CustomRendererModule from './CustomRenderer';
import CustomPropertiesProviderModule from './CustomPropertiesProvider';
import SustainabilityExtension from './SustainabilityExtension';

import { Button, KIND } from 'baseui/button';

const HIGH_PRIORITY = 1500;

const options = { format: true }

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.canvas = React.createRef();
        this.propertiesPanel = React.createRef();
    }

    componentDidMount() {

        const container = this.canvas.current;

        this.modeler = new Modeler({
            container,
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            moddleExtensions: {
                sustainability: SustainabilityExtension
            },
            additionalModules: [
                CustomPathMap,
                CustomRendererModule,
                CustomPropertiesProviderModule,
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule
            ]
        });

        this.modeler.on('element.click', HIGH_PRIORITY, (event) => {
            const businessObject = getBusinessObject(event.element);
            console.log(businessObject);
        });
    }

    componentWillUnmount() {
        this.modeler.destroy();
    }

    componentDidUpdate(prevProps, prevState) {

        const {
            props,
            state
        } = this;

        const current = props.model || state.model;

        const previous = prevProps.model || prevState.model;

        if (current && current !== previous) {
            return this.displayModel(current);
        }
    }

    async displayModel(model) {

        this.handleLoading();

        try {
            const {
                warnings
            } = await this.modeler.importXML(model);
        } catch (error) {
            const {
                warnings
            } = error;
            warnings.forEach(warning => {
                this.handleError(`${warning.error}`);
            });
        }
    }

    uploadModel = (event) => {

        const file = event.target.files[0];

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = async (event) => {
            this.setState({ model: reader.result })
        }

        reader.onerror = function (event) {
            console.log(event);
            return this.handleError(`File upload error: ${file.name}`);
        }
    }

    downloadModel = async () => {

        const { xml: model } = await this.modeler.saveXML(options);

        const modelURL = URL.createObjectURL(new Blob([model], {
            type: 'text/plain'
        }));

        const anchor = document.createElement('a');
        anchor.href = modelURL;
        anchor.download = 'sustainable-application-model.bpmn';

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        URL.revokeObjectURL(modelURL);
    }

    handleLoading() {
        const { onLoading } = this.context;

        if (onLoading) {
            onLoading();
        }
    }

    handleError(error) {
        const { onError } = this.context;

        if (onError) {
            onError(error);
        }
    }

    handleSuccess(info) {
        const { onSuccess } = this.context;

        if (onSuccess) {
            onSuccess(info);
        }
    }

    render() {
        return (
            <div style={{ height: '100%', position: 'relative' }}>
                <div className='canvas' id='js-canvas' ref={this.canvas} />
                <div className='properties-panel' id='js-properties-panel' ref={this.propertiesPanel} />
                <div className='button-container'>
                    <Button className='upload-button' onClick={() => { document.getElementById('file-input').click() }}>Upload Model</Button>
                    <input id='file-input' type='file' accept='text/bpmn' onChange={this.uploadModel} hidden />
                    <Button className='download-button' kind={KIND.secondary} onClick={this.downloadModel}>Download Model</Button>
                </div>
            </div>
        );
    }
}

App.contextType = AppContext;

export default App;