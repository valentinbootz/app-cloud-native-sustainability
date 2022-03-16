import PathMap from 'bpmn-js/lib/draw/PathMap'

export default function CustomPathMap() {

    let pathMap = new PathMap;

    pathMap.pathMap.MARKER_MODALITY = {
        d: 'm {mx},{my} v -12 h 12 v 12 z',
        height: 10,
        width: 10,
        heightElements: [],
        widthElements: []
    }

    return pathMap;
};
