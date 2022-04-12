import {
  TextFieldEntry, isTextFieldEntryEdited,
  ToggleSwitchEntry, isToggleSwitchEntryEdited,
  TextAreaEntry, isTextAreaEntryEdited,
  ListEntry,
  CollapsibleEntry
} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'
import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;

const types = {
  standard: "bpmncns:StandardExecutionModality",
  highPerformance: "bpmncns:HighPerformanceExecutionModality",
  lowPower: "bpmncns:LowPowerExecutionModality"
}

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function CustomPropertiesProvider(propertiesPanel, translate, moddle) {

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

  function createGroup(element, translate) {

    return {
      id: 'cloud-native-sustainability',
      label: translate('Cloud Native Sustainability'),
      entries: [
        {
          id: 'service-identifier-metadata',
          component: <ServiceIdentifier id='service-identifier-metadata-component' element={element} />,
          isEdited: isTextFieldEntryEdited
        },
        {
          id: 'optional-metadata',
          component: <OptionalMetadata id='optional-metadata-component' element={element} />,
          isEdited: isToggleSwitchEntryEdited
        },
        {
          id: 'execution-modality-metadata',
          component: <ExecutionModalityMetadata id='execution-modality-metadata-component' element={element} />
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
      return element.businessObject.identifier || '';
    }

    const setValue = value => {
      return modeling.updateProperties(element, {
        identifier: value
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

    const items = (() => {

      let elements = element.businessObject.extensionElements;

      let standard, highPerformance, lowPower;

      if (typeof elements === 'undefined') { }
      else ({
        standard,
        highPerformance,
        lowPower
      } = elements.values.find(value => value.$type == "bpmncns:ExecutionModalities"));

      return [
        {
          id: 'high-performance',
          label: 'High Performance',
          type: 'highPerformance',
          element: element,
          value: highPerformance,
        },
        {
          id: 'standard',
          label: 'Standard',
          type: 'standard',
          element: element,
          value: standard,
        },
        {
          id: 'low-power',
          label: 'Low Power',
          type: 'lowPower',
          element: element,
          value: lowPower,
        }
      ];
    })();

    const renderItem = (props) => {
      const { element, id, label, type, value } = props;
      return <ExecutionModality id={id} label={label} type={type} element={element} value={value} />
    }

    const entry = <ListEntry
      id={id}
      element={element}
      items={items}
      renderItem={renderItem}
      label={translate('Execution Modality')}
      open={true}
    />

    return entry;
  }

  function ExecutionModality(props) {

    const { element, id, label, type, value } = props;

    const translate = useService('translate');

    const getEntries = (element) => {

      let id, name, description;

      if (typeof value === 'undefined') { }
      else ({
        id,
        name,
        description
      } = value);

      return [
        {
          id: 'id',
          component: <Id id='id-component' element={element} type={type} value={id} />,
          isEdited: isTextFieldEntryEdited
        },
        {
          id: 'name',
          component: <Name id='name-component' element={element} type={type} value={name} />,
          isEdited: isTextFieldEntryEdited
        },
        {
          id: 'description',
          component: <Description id='description-component' element={element} type={type} value={description} />,
          isEdited: isTextAreaEntryEdited
        }
      ];
    }

    const entry = <CollapsibleEntry
      id={id}
      entries={getEntries(element)}
      label={translate(label)}
    />

    return entry;
  }

  function Id(props) {
    const { element, id, type, value } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');

    const getValue = () => {
      return value;
    }

    const setValue = value => {
      setPropByType(element, type, 'id', value, commandStack)
    }

    const entry = <TextFieldEntry
      id={id}
      element={element}
      label={translate('Id')}
      description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />

    return entry;
  }

  function Name(props) {
    const { element, id, type, value } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');

    const getValue = () => {
      return value;
    }

    const setValue = value => {
      setPropByType(element, type, 'name', value, commandStack)
    }

    const entry = <TextFieldEntry
      id={id}
      element={element}
      label={translate('Name')}
      description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />

    return entry;
  }

  function Description(props) {
    const { element, id, type, value } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');

    const getValue = () => {
      return value;
    }

    const setValue = value => {
      setPropByType(element, type, 'description', value, commandStack)
    }

    const entry = <TextAreaEntry
      id={id}
      element={element}
      label={translate('Description')}
      description={translate('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />

    return entry;
  }

  function setPropByType(element, type, prop, value, commandStack) {

    const commands = [];

    let businessObject = element.businessObject;
    let elements = businessObject.get('extensionElements');

    if (!elements) {
      elements = moddle.create("bpmn:ExtensionElements", {
        values: []
      });

      elements.$parent = element.businessObject;

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            elements
          }
        }
      });
    }

    let modalities = elements.values.find(value => value.$type == "bpmncns:ExecutionModalities");

    if (!modalities) {
      modalities = moddle.create("bpmncns:ExecutionModalities", {});
      modalities.$parent = elements;
    }

    let current;
    if (type in modalities) {
      current = modalities[type]
    } else {
      current = {};
    }

    let props = (({ id, name, description }) => ({ id, name, description }))({
      ...current, ...{
        [prop]: value
      }
    })

    if (Object.values(props).some(prop => typeof prop !== 'undefined')) {
      modalities[type] = moddle.create(types[type], props);
    } else {
      delete modalities[type];
    }

    let values = elements.get('values').filter(value => !(value.$type === 'bpmncns:ExecutionModalities'))

    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: elements,
        properties: {
          values: [...values, modalities]
        }
      }
    });

    commandStack.execute('properties-panel.multi-command-executor', commands);
  }
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle'];