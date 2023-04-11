import { Handle, Position } from 'reactflow';

function FlowNodeTrigger({ data }: { data: any }) {
  return (
    <>
      <div className='d-flex flex-column text-start gap-1'>
        {/* <div className='d-flex gap-2 align-items-center text-secondary'>
          <FontAwesomeIcon icon={faList} />
          Form
        </div> */}
        <div className='text-center'>{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

export default FlowNodeTrigger;