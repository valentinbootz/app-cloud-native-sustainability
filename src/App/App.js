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
import { ArrowUp, ArrowDown, Upload } from "baseui/icon";

import { SustainableApplicationModel } from 'cloud-native-sustainability';
import { SustainabilityFeedback } from './SustainabilityFeedback';

const HIGH_PRIORITY = 1500;

const options = { format: true }

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedback: {
                "sustainability awareness": 0,
                "microservice classification": 0,
                "microservice enrichment": 0
            }
        }
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

        this.modeler.createDiagram();

        // this.modeler.importXML(FlightBooking);
        // this.importModel(FlightBooking);

        this.modeler.on('elements.changed', HIGH_PRIORITY, (event) => {
            this.handleUpdate();
        })

        this.modeler.on('element.click', HIGH_PRIORITY, (event) => {
            const businessObject = getBusinessObject(event.element);
            console.log(businessObject);
        });
    }

    componentWillUnmount() {
        this.modeler.destroy();
    }

    async importModel(model) {

        this.handleLoading();

        const { xml: current } = await this.modeler.saveXML(options);

        this.modeler.destroy();

        this.componentDidMount();

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
            this.modeler.importXML(current);
        }

        this.modeler.get('canvas').zoom('fit-viewport');

        this.handleUpdate();
    }

    async handleUpdate() {

        const { xml: current } = await this.modeler.saveXML(options);

        let model = new SustainableApplicationModel(current)

        const {
            scores,
            services
        } = await model.feedback;

        this.setState({
            feedback: scores
        });

        let overlays = this.modeler.get('overlays');

        for (const [identifier, service] of Object.entries(services)) {

            let element = this.modeler.get('elementRegistry').find(element => element.businessObject.identifier == identifier);

            if (typeof element === 'undefined') { break; }

            let id = element.id;

            overlays.remove({ element: `${id}` });

            const {
                optional,
                modalities,
            } = service;

            // TODO: Add overlay to service

            // overlays.add(`${id}`, 'optional-note', {
            //     html: `<div></div>`
            // });
        };
    }

    fetchMetadata = async () => {

        const { xml: current } = await this.modeler.saveXML(options);
        let model = new SustainableApplicationModel(current);

        const services = await fetch('http://localhost/sustainability')
            .then(response => response.json())
            .then(response => response.services);

        this.handleSuccess("Fetch metadata successful!");
        this.importModel(await model.update(services));
    }

    uploadModel = (event) => {

        const file = event.target.files[0];

        event.target.value = null;

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = async (event) => {

            this.handleSuccess("Import successful!");

            this.importModel(reader.result);
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
        anchor.download = 'Model.xml';

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
            <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div className='canvas' id='js-canvas' ref={this.canvas} />
                <div className='properties-panel' id='js-properties-panel' ref={this.propertiesPanel} />
                <div className='button-container'>
                    <Button className='upload-button' startEnhancer={() => <ArrowUp size={24} />} onClick={() => { document.getElementById('file-input').click() }}>Upload Model</Button>
                    <input id='file-input' type='file' accept='text/bpmn' onChange={this.uploadModel} hidden />
                    <Button className='download-button' startEnhancer={() => <ArrowDown size={24} />} kind={KIND.secondary} onClick={this.downloadModel}>Download Model</Button>
                    <Button className='fetch-button' startEnhancer={() => <Upload size={24} />} onClick={this.fetchMetadata}>Fetch Metadata</Button>
                </div>
                <SustainabilityFeedback feedback={this.state.feedback} />
            </div>
        );
    }
}

App.contextType = AppContext;

export default App;