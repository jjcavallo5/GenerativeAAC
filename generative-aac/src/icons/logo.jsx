import * as React from "react";

function Logo(props) {
    return (
        <svg
            // xmlns:dc="http://purl.org/dc/elements/1.1/"
            // xmlns:cc="http://creativecommons.org/ns#"
            // xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            // xmlns:svg="http://www.w3.org/2000/svg"
            // xmlns="http://www.w3.org/2000/svg"
            width="210mm"
            height="297mm"
            viewBox="0 0 210 297"
            version="1.1"
            id="svg8"
        >
            <defs id="defs2" />

            <g id="layer1">
                <g
                    aria-label="G"
                    id="text18"
                    style={{
                        fontSize: 4.23333 + "px",
                        lineHeight: 1.25,
                        fontFamily: "Arial",
                        strokeWidth: 0.264583,
                    }}
                />
                <path
                    style={{
                        fill: props.mainColor,
                        stroke: "#000000",
                        strokeWidth: 0,
                    }}
                    d="m 102.62959,88.275426 c -7.356358,7.618584 -7.356358,7.618584 -7.356358,7.618584 -4.86173,0 -10.139219,-1.25205 -13.281146,-4.89007 -2.976562,-3.439583 -4.464843,-7.631574 -4.464843,-12.575975 0,-5.060156 1.463476,-9.310026 4.390429,-12.749609 3.092318,-3.638021 7.118946,-5.457032 12.07989,-5.457032 2.54661,0 4.99401,0.603581 7.342188,1.810743 2.36471,1.190625 4.24987,2.827734 5.65546,4.911328 0.21497,0.314193 0.32246,0.553971 0.32246,0.719336 0,0.23151 -0.59531,1.000455 -1.78593,2.306835 -1.17409,1.289844 -1.85209,1.934766 -2.03399,1.934766 -0.13229,0 -0.63665,-0.504362 -1.51308,-1.513086 -1.05833,-1.223698 -2.067058,-2.158008 -3.026168,-2.802929 -1.50482,-1.008724 -3.07579,-1.513086 -4.7129,-1.513086 -3.12539,0 -5.688542,1.30638 -7.689453,3.91914 -1.819011,2.38125 -2.728516,5.192448 -2.728516,8.433594 0,3.158463 0.93431,5.953125 2.80293,8.383984 2.033984,2.629291 4.588869,3.943941 7.664649,3.943941 3.02617,0 5.804298,-0.82682 8.334378,-2.480464 z"
                    id="path890"
                />
                <path
                    style={{
                        fill: props.accentColor,
                        stroke: "#000000",
                        strokeWidth: 0,
                        fillOpacity: 1,
                    }}
                    d="m 96.894141,76.806291 -5.73428,5.734275 H 102.62959 V 94.01029 l 5.73506,-5.735064 V 76.806291 Z"
                    id="rect849"
                />
                <text
                    // xml:space="preserve"
                    style={{
                        fontSize: 4.23333 + "px",
                        lineHeight: 1.25,
                        fontFamily: "Arial",
                        letterSpacing: 0.264583 + "px",
                        strokeWidth: 0.264583,
                    }}
                    x="76.497353"
                    y="103.019"
                    id="text879"
                >
                    <tspan
                        id="tspan877"
                        x="76.497353"
                        y="103.019"
                        style={{
                            fontStyle: "normal",
                            fontVariant: "normal",
                            fontWeight: 900,
                            fontStretch: "normal",
                            fontFamily: "Arial",
                            strokeWidth: 0.264583,
                        }}
                    >
                        GENERATIVE
                    </tspan>
                </text>
                <text
                    // xml:space="preserve"
                    style={{
                        fontSize: 3.52778 + "px",
                        lineHeight: 1.25,
                        fontFamily: "Arial",
                        letterSpacing: 0.529167 + "px",
                        strokeWidth: 0.264583,
                        fill: props.textColor,
                    }}
                    x="88.862297"
                    y="106.394"
                    id="text883"
                >
                    <tspan
                        id="tspan881"
                        x="88.862297"
                        y="106.394"
                        style={{
                            fontSize: 3.52778 + "px",
                            strokeWidth: 0.264583,
                        }}
                    >
                        AAC
                    </tspan>
                </text>
            </g>
        </svg>
    );
}

export default Logo;
