import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, registerables } from "chart.js";

import {
    DisplaySmall
} from 'baseui/typography';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const colors = [
    { pct: 0, color: { r: 0xe7, g: 0x4c, b: 0x3c } },
    { pct: 50, color: { r: 0xff, g: 0xa4, b: 0x2e } },
    { pct: 100, color: { r: 0x2e, g: 0xcc, b: 0x71 } }
];

function getColorByValue(pct) {
    for (var i = 1; i < colors.length - 1; i++) {
        if (pct < colors[i].pct) {
            break;
        }
    }
    var lower = colors[i - 1];
    var upper = colors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return "rgba(" + [color.r, color.g, color.b, 1].join(",") + ")";
}

const Visual = (props) => {

    const {
        name,
        value
    } = props;

    const data = {
        labels: [name],
        datasets: [
            {
                data: [value, 100 - value],
                backgroundColor: [getColorByValue(value), "rgba(220, 220, 220, 1)"],
                borderColor: ["rgba(255, 255, 255 ,1)", "rgba(255, 255, 255 ,1)"],
                borderWidth: 5
            }
        ]
    };

    const options = {
        rotation: -90,
        circumference: 180,
        cutout: "90%",
        hoverBorderColor: "white",
        plugins: {
            title: {
                display: true,
                text: name,
                font: {
                    family: "system-ui, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    size: 16,
                    weight: 500
                },
                color: 'rgb(0,0,0)',
                padding: {
                    top: 30,
                    bottom: 0
                }
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Doughnut width={200} height={200} data={data} options={options} />
            <div style={{ left: '50%', bottom: '5%', transform: 'translate(-50%, -50%)', position: 'absolute' }}>
                <DisplaySmall>{Math.round(value)}</DisplaySmall>
            </div>
        </div>
    );
}

export const SustainabilityFeedback = (props) => {

    const {
        ["sustainability awareness"]: awareness,
        ["microservice classification"]: classification,
        ["microservice enrichment"]: enrichment
    } = props.feedback;

    return (
        <div className='sustainability-feedback' style={{
            position: 'absolute',
            top: '0',
            right: '330px',
            zIndex: -1
        }} >
            <Visual name="Sustainability Awareness" value={awareness} />
            <Visual name="Microservice Classification" value={classification} />
            <Visual name="Microservice Enrichment" value={enrichment} />
        </div>
    );
}
