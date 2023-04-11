import { Handle, Position } from 'reactflow';

function FlowNode({ data }: { data: any }) {
  return (
    <>
    
      <div className='d-flex flex-column text-start gap-1'>
        {/* <div className='d-flex gap-2 align-items-center text-secondary'>
          <FontAwesomeIcon icon={faList} />
          Form
        </div> */}
        <div className='text-center'>{data.label}</div>
      </div>
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="target" position={Position.Bottom} id="c" />
    </>
  );
}

export default FlowNode;