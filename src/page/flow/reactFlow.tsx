import { faClipboard, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faList, faMagnifyingGlass, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, { addEdge, Background, Connection, Controls, Edge, Node, ReactFlowProvider, updateEdge, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { ContextMenu } from "../../components/reactFlow/contextMenu";
import FlowNode from '../../components/reactFlow/flowNode';
import FlowNodeConditon from '../../components/reactFlow/flowNodeConditon';
import FlowNodeSend from '../../components/reactFlow/flowNodeSend';
import FlowNodeTrigger from '../../components/reactFlow/flowNodeTrigger';
import NodeOffcanvas from '../../components/reactFlow/nodeOffcanvas';
import ToolBar from '../../components/reactFlow/toolbar';
import { IFormData } from '../../types/formio';
import { urlForm } from '../formio/request';
import { saveFlow, updateFlowToForm, urlFlow } from './request';

const BasicFlow = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isUpdate = (id != 'new')
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowWrapper = useRef<React.LegacyRef<HTMLDivElement> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [nodeData, setNodeData] = useState<Node | undefined>(undefined);
  const [edgeData, setEdgeData] = useState<Edge | undefined>(undefined)
  const [nodeContext, setNodeContext] = useState<Node | undefined>(undefined);
  const [isMenu, setIsMenu] = useState(false);
  const [isNode, setIsNode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [formsData, setFormsData] = useState<IFormData[]>([]);

  useEffect(() => {
    async function getData() {
      const resForms = await fetch(urlForm).then(res => res.json())
      setFormsData(resForms)
      const resData = await fetch(urlFlow + `/${id}`).then(res => res.json())
      setNodes(resData.nodes)
      setEdges(resData.edges)
    }
    if (isUpdate) {
      getData()
    }
  }, [])

  const nodeTypes = useMemo(() => ({ form: FlowNodeTrigger, email: FlowNode, condition: FlowNodeConditon, lines: FlowNodeConditon, table: FlowNode, send: FlowNodeSend }), []);

  const onConnect = useCallback(
    (connection: Edge<any> | Connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /* const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };
    setNodes((nds) => nds.concat(newNode));
  },
    [reactFlowInstance]
  ); */

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge: Edge<any>, newConnection: Connection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_: any, edge: { id: string; }) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setNodeData(node)
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsMenu(true)
  }, [])

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setNodeContext(node);
  }, [])

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setIsNode(true)
  }, [])

  const deleteNode = () => {
    if (nodeContext) {
      setEdges(edges => edges.filter(edge => (edge.source != nodeContext.id && edge.target != nodeContext.id)));
      setNodes((nodes) => nodes.filter((node) => node.id != nodeContext.id))
    }
    setIsMenu(false)
  }

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdgeData(edge)
  }, [])

  const onSubmit = async (data: any) => {
    if (nodeData) {
      if (nodeData.type == 'form' && data.templateId && id) {
        const formDataById = formsData.find(form => form.id == data.templateId)
        formDataById && updateFlowToForm(formDataById, id)
      } else if (nodeData.type == 'condition') {

      } else if (nodeData.type == 'email') {

      }
      setNodes(nodes => nodes.map(node => node.id == nodeData.id ? ({ ...node, data: { ...data } }) : node))
    }
  }

  function addNode(type: string, data?: any) {
    const nextIndex = nodes.length == 0 ? 0 : parseInt(nodes.sort((a, b) => parseInt(a.id) - parseInt(b.id)).slice(-1)[0].id);
    setNodes((nodes: Node[]) => {
      return [...nodes, { id: `${nextIndex + 1}`, type: type, data: { label: `${type} ${nextIndex + 1}` }, position: { x: 0, y: 10 } }]
    })
  }

  return (<Card body className="h-100 border-0">
    <div className="boder-2 border-bottom pb-2 mb-2 d-flex gap-2">
      <Dropdown>
        <Dropdown.Toggle variant='light' id="dropdown-basic" size='sm'>
          ------
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <button className='btn btn-sm btn-secondary ms-auto' onClick={() => navigate('/flow')}>
        Back
      </button>
      <button onClick={async () => {
        setIsLoading(true)
        await saveFlow(isUpdate, id, { nodes, edges })
        setIsLoading(false)
      }} className="btn btn-sm btn-primary">
        <FontAwesomeIcon icon={isLoading ? faSync : faCheck} className={clsx(isLoading && 'fa-spin')} />
      </button>
    </div>

    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" /* ref={reactFlowWrapper} */>
          <ReactFlow
            style={{
              minHeight: window.innerHeight - 82.5
            }}
            fitView
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onNodeClick={onNodeClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            // onEdgeContextMenu={onEdgeContextMenu}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
          >
            <ContextMenu
              isOpen={isMenu}
              position={position}
              onmouseleave={() => setIsMenu(false)}
              actions={[{ label: 'Delete', effect: deleteNode }]}
            />
            {nodeData && <NodeOffcanvas {...{
              formsData,
              isNode,
              nodeData,
              handleClose: () => setIsNode(false),
              onSubmit,
              nodes,
              edges
            }} />}
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <ToolBar />
      </ReactFlowProvider>
    </div>
  </Card>
  );
};

export default BasicFlow;

