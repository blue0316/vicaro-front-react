/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import styled from 'styled-components';
import { useRanger } from "react-ranger";

export const Track = styled("div")`
  display: inline-block;
  height: 8px;
  width: 90%;
  margin: 0 5%;
`;

export const Tick = styled("div")`
  :before {
    content: "";
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 5px;
    width: 2px;
    transform: translate(-50%, 0.7rem);
  }
`;

export const TickLabel = styled("div")`
  position: absolute;
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.5);
  top: 100%;
  transform: translate(-50%, 1.2rem);
  white-space: nowrap;
`;

export const Segment = styled("div")`
  background: ${props =>
        props.index === 0
            ? "#3e8aff"
            : props.index === 1
                ? "#00d5c0"
                : props.index === 2
                    ? "#f5c200"
                    : "#ff6050"};
  height: 100%;
`;

export const Handle = styled("div")`
  background: #ff1a6b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  font-size: 0.7rem;
  white-space: nowrap;
  color: white;
  font-weight: ${props => (props.active ? "bold" : "normal")};
  transform: ${props =>
        props.active ? "translateY(-100%) scale(1.3)" : "translateY(0) scale(0.9)"};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

function MultiRange(props) {

    const [values, setValues] = useState(props.value);

    const setValue = value => {
        props.setValue(props.type, value);
        setValues(value);
    }

    const { getTrackProps, ticks, segments, handles } = useRanger({
        min: 0,
        max: 100,
        stepSize: 0.5,
        values,
        onChange: setValue
    });

    return (
        <Track {...getTrackProps()}>
            {ticks.map(({ value, getTickProps }) => (
                <Tick {...getTickProps()}>
                    <TickLabel>{value}</TickLabel>
                </Tick>
            ))}
            {segments.map(({ getSegmentProps }, i) => (
                <Segment {...getSegmentProps()} index={i} />
            ))}
            {handles.map(({ value, active, getHandleProps }) => (
                <button
                    {...getHandleProps({
                        style: {
                            appearance: "none",
                            border: "none",
                            background: "transparent",
                            outline: "none"
                        }
                    })}
                >
                    <Handle active={active}>{value}</Handle>
                </button>
            ))}
        </Track>
    );
}

export default MultiRange;
