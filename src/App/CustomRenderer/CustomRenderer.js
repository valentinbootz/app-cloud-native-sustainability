import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import {
  append,
  attr,
} from 'tiny-svg';

import {
  assign,
} from 'min-dash';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY);

    this.pathMap = pathMap;
  }

  canRender(element) {
    return is(element, 'bpmn:ServiceTask') && !element.labelTarget;
  }

  drawShape(parentNode, element) {

    const shape = super.drawShape(parentNode, element);

    const businessObject = getBusinessObject(element);

    const { optional } = businessObject;

    if (optional) {
      const border = super.drawShape(parentNode, element);

      attr(border, {
        x: 2.25,
        y: 2.25,
        height: border.height.baseVal.value - 4.5,
        width: border.width.baseVal.value - 4.5,
        rx: 8.5,
        ry: 8.5,
        style: 'stroke: black; stroke-dasharray: 2; stroke-width: 1px; fill: none; fill-opacity: 0.95;'
      });

      append(parentNode, border);
    }

    var markerPath = this.pathMap.getScaledPath('MARKER_MODALITY', {
      xScaleFactor: 1,
      yScaleFactor: 1,
      containerWidth: element.width,
      containerHeight: element.height,
      position: {
        mx: ((element.width / 2 + 31) / element.width),
        my: (element.height - 7) / element.height
      }
    });

    this._drawPath(parentNode, markerPath, assign({ 'data-marker': 'modality' }, {
      strokeWidth: 1
    }));

    return shape;
  }

  getShapePath(shape) {
    return super.getShapePath(shape);
  }
}

CustomRenderer.$inject = ['config', 'eventBus', 'styles', 'pathMap', 'canvas', 'textRenderer'];