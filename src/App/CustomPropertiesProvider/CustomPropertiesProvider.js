import {
  TextFieldEntry, isTextFieldEntryEdited,
  ToggleSwitchEntry, isToggleSwitchEntryEdited,
  ListEntry,
  CollapsibleEntry,
} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'
import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function CustomPropertiesProvider(propertiesPanel, translate) {

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {

      if (is(element, 'bpmn:ServiceTask')) {
        groups.push(createGroup(element, translate));
      }

      return groups;
    }
  };

  // Register custom properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

function createGroup(element, translate) {

  return {
    id: 'cloud-native-sustainability',
    label: translate('Cloud Native Sustainability'),
    entries: [
      {
        id: 'serviceIdentifierMetadata',
        component: <ServiceIdentifier id='serviceIdentifierMetadataComponent' element={element} />,
        isEdited: isTextFieldEntryEdited
      },
      {
        id: 'optionalMetadata',
        component: <OptionalMetadata id='optionalMetadataComponent' element={element} />,
        isEdited: isToggleSwitchEntryEdited
      },
      {
        id: 'executionModalityMetadata',
        component: <ExecutionModalityMetadata id='executionModalityMetadataComponent' element={element} />
      }
    ]
  };
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

  const translate = useService('translate');

  const items = [
    {
      id: 'highPerformance',
      element: element,
      label: 'High Performance'
    },
    {
      id: 'standard',
      element: element,
      label: 'Standard'
    },
    {
      id: 'lowPower',
      element: element,
      label: 'Low Power'
    }
  ];

  const renderItem = (props) => {
    const { element, id, label } = props;
    return <ExecutionModality id={id} element={element} label={label} />
  }

  const entry = <ListEntry
    id={id}
    element={element}
    items={items}
    renderItem={renderItem}
    label={translate('Execution Modality')}
  />

  return entry;
}

function ExecutionModality(props) {
  const { element, id, label } = props;

  const translate = useService('translate');

  const getEntries = (element) => [
    {
      id: 'versionIdentifier',
      component: <Implementation id='versionIdentifierComponent' element={element} />,
      isEdited: isTextFieldEntryEdited
    }
  ];

  const entry = <CollapsibleEntry
    id={id}
    entries={getEntries(element)}
    label={translate(label)}
  />

  return entry;
}

function Implementation(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
    });
  }

  const entry = <TextFieldEntry
    id={id}
    element={element}
    label={translate('Implementation')}
    description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
    getValue={getValue}
    setValue={setValue}
    debounce={debounce}
  />

  return entry;
}

