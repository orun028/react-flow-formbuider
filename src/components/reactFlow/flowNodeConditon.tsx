import { Handle, Position,  } from 'reactflow';
// const handleStyle = { left: 10 };

function FlowNodeConditon({ data }: { data: any }) {
  return (
    <>
      <Handle type="source" position={Position.Top} id="c"/>
      <div className='d-flex flex-column text-start gap-1'>
        <div className='text-center'>{data.label}</div>
      </div>
      <Handle type="target" position={Position.Left} id="a" />

      <Handle type="source" position={Position.Bottom} id="d"/>
    </>
  );
}

export default FlowNodeConditon;