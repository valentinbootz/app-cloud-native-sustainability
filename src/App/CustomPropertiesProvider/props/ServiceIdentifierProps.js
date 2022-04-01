import {
    TextFieldEntry, isTextFieldEntryEdited
} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'

export default function (element) {

    return [
        {
            id: 'serviceIdentifierMetadata',
            component: <ServiceIdentifier id='serviceIdentifier' element={element} />,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

function ServiceIdentifier(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.serviceId || '';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            serviceId: value
        });
    }

    const entry = <TextFieldEntry
        id={id}
        element={element}
        label={translate('Service Identifier')}
        description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
        getValue={getValue}
        setValue={setValue}
        debounce={debounce}
    />

    return entry;
}