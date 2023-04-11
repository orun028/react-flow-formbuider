import { faEnvelope, faClipboard } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass, faList, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
import { Card } from "react-bootstrap";

const ToolBar = () => {
    return <Card className='react-flow__panel react-flow__controls top left p-1 gap-1'>
        {/* <button onClick={() => addNode('condition')} className="react-flow__controls-button p-2 border-0" disabled={!nodes.length}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button onClick={() => addNode('form')} className="react-flow__controls-button p-2 border-0">
            <FontAwesomeIcon icon={faList} />
        </button>
        <button onClick={() => addNode('email')} className="react-flow__controls-button p-2 border-0" disabled={!nodes.length}>
            <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button onClick={() => addNode('table')} className="react-flow__controls-button p-2 border-0" disabled={!nodes.length}>
            <FontAwesomeIcon icon={faClipboard} />
        </button>
        <button onClick={() => addNode('send')} className="react-flow__controls-button p-2 border-0" disabled={!nodes.length}>
            <FontAwesomeIcon icon={faCheck} />
        </button> */}
    </Card>
}

export default ToolBar;