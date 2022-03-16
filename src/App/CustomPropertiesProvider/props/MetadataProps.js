import {
  ToggleSwitchEntry, isToggleSwitchEntryEdited,
  SelectEntry, isSelectEntryEdited
} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'

export default function (element) {

  return [
    {
      id: 'optionalMetadata',
      component: <OptionalMetadata id='optionalMetadata' element={element} />,
      isEdited: isToggleSwitchEntryEdited
    },
    {
      id: 'executionModalityMetadata',
      component: <ExecutionModalityMetadata id='executionModalityMetadata' element={element} />,
      isEdited: isSelectEntryEdited
    }
  ];
}

function OptionalMetadata(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');

  const getValue = () => {
    return element.businessObject.optional || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      optional: value
    });
  }

  const entry = <ToggleSwitchEntry
    id={id}
    element={element}
    label={translate('Optional')}
    switcherLabel={translate('This is a label')}
    description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
    getValue={getValue}
    setValue={setValue}
  />

  return entry;
}

function ExecutionModalityMetadata(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');

  const getOptions = () => {
    return [
      { label: 'High Performance', value: 'highPerformance' },
      { label: 'Normal', value: 'normal' },
      { label: 'Low Power', value: 'lowPower' },
      { label: '', value: '' }
    ];
  }

  const getValue = () => {
    return element.businessObject.executionModality || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      executionModality: value
    });
  }

  const entry = <SelectEntry
    id={id}
    element={element}
    label={translate('Execution Modality')}
    description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
    getOptions={getOptions}
    getValue={getValue}
    setValue={setValue}
    disabled={false}
  />

  return entry;
}