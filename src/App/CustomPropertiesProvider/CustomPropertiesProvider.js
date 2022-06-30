import './CustomPropertiesProvider.css'

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
  standard: "sustainability:StandardExecutionModality",
  highPerformance: "sustainability:HighPerformanceExecutionModality",
  lowPower: "sustainability:LowPowerExecutionModality"
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
      description={translate('The service identifier can be used to associate versions of the service with the model element.')}
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
      label={translate('Optional Metadata')}
      switcherLabel={translate('Optional')}
      description={translate('Services can be defined optional or mandatory for the business process.')}
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
      } = elements.values.find(value => value.$type == "sustainability:ExecutionModalities"));

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

      let id, name, description, requirements;

      if (typeof value === 'undefined') { }
      else ({
        id,
        name,
        description,
        requirements
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
        },
        {
          id: 'requirements',
          component: <ServiceRequirements id='requirements-component' element={element} type={type} value={requirements} />
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
      description={translate('Identifier for the version of the service.')}
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
      description={translate('Name for the version of the service.')}
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
      description={translate('Description for the version of the service.')}
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

      elements.$parent = businessObject;

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            extensionElements: elements
          }
        }
      });
    }

    let modalities = elements.values.find(value => value.$type == "sustainability:ExecutionModalities");

    if (!modalities) {
      modalities = moddle.create("sustainability:ExecutionModalities", {});
      modalities.$parent = elements;
    }

    let current;
    if (type in modalities) {
      current = modalities[type]
    } else {
      current = {};
    }

    let props = (({ id, name, description, requirements }) => ({ id, name, description, requirements }))({
      ...current, ...{
        [prop]: value
      }
    })

    if (typeof value === 'undefined') {
      delete props[prop];
    }

    if (Object.values(props).some(prop => typeof prop !== 'undefined')) {
      modalities[type] = moddle.create(types[type], props);
    } else {
      delete modalities[type];
    }

    let values = elements.get('values').filter(value => !(value.$type === 'sustainability:ExecutionModalities'))

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

    console.log(commands)

    commandStack.execute('properties-panel.multi-command-executor', commands);
  }

  function ServiceRequirements(props) {
    const { element, id, type, value } = props;

    const translate = useService('translate');

    const getEntries = (element) => {

      let responseTime, instanceType;

      if (typeof value === 'undefined') { }
      else ({
        responseTime,
        instanceType
      } = value);

      return [
        {
          id: 'response-time',
          component: <ResponseTime id={id} type={type} element={element} content={responseTime} />,
          isEdited: isTextFieldEntryEdited
        },
        {
          id: 'instance-type',
          component: <InstanceType id={id} type={type} element={element} content={instanceType} />,
          isEdited: isTextFieldEntryEdited
        }
      ];
    }

    const entry = <CollapsibleEntry
      id={id}
      entries={getEntries(element)}
      label={translate('Requirements')}
    />

    return entry;
  }

  function ResponseTime(props) {
    const { element, id, type, content } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');

    let value;
    if (typeof content === 'undefined') { }
    else ({
      value
    } = content);

    const getValue = () => {
      return value;
    }

    const setValue = value => {

      let requirements;

      if (typeof value !== 'undefined') {
        let elements = element.businessObject.extensionElements;
        if (typeof elements !== 'undefined') {
          let modalities = elements.values.find(element => element.$type === "sustainability:ExecutionModalities");
          if (typeof modalities !== 'undefined') {
            let modality = modalities[type];
            if (typeof modality !== 'undefined') {
              requirements = modality.requirements;
            }
          }
        }
        if (typeof requirements === 'undefined') {
          requirements = moddle.create("sustainability:ServiceRequirements", {});
        }
        requirements['responseTime'] = moddle.create("sustainability:ResponseTimeRequirement", { value })
      }
      setPropByType(element, type, 'requirements', requirements, commandStack)
    }

    const entry = <TextFieldEntry
      id={id}
      element={element}
      label={translate('Response Time')}
      description={translate('Requirement for the response time of the service.')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />

    return entry;
  }

  function InstanceType(props) {
    const { element, id, type, content } = props;

    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');

    let value;
    if (typeof content === 'undefined') { }
    else ({
      value
    } = content);

    const getValue = () => {
      return value;
    }

    const setValue = value => {

      let requirements;

      if (typeof value !== 'undefined') {
        let elements = element.businessObject.extensionElements;
        if (typeof elements !== 'undefined') {
          let modalities = elements.values.find(element => element.$type === "sustainability:ExecutionModalities");
          if (typeof modalities !== 'undefined') {
            let modality = modalities[type];
            if (typeof modality !== 'undefined') {
              requirements = modality.requirements;
            }
          }
        }
        if (typeof requirements === 'undefined') {
          requirements = moddle.create("sustainability:ServiceRequirements", {});
        }
        requirements['instanceType'] = moddle.create("sustainability:InstanceTypeRequirement", { value })
      }
      setPropByType(element, type, 'requirements', requirements, commandStack)
    }

    const entry = <TextFieldEntry
      id={id}
      element={element}
      label={translate('Instance Type')}
      description={translate('Requirement for the instance type of the service.')}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />

    return entry;
  }
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle'];