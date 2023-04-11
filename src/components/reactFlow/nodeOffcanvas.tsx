import { FC, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Node, Edge } from "reactflow";
import { IFormData } from "../../types/formio";
import { INodeTypeItem } from "../../types/reactFlow";
import Select from 'react-select'
import { useState } from "react";

interface PropsNodeOffcanvas {
    formsData: IFormData[]
    nodeData: Node
    onSubmit: (data: any) => Promise<void>
    isNode: boolean
    handleClose: () => void
    nodes: Node[]
    edges: Edge[]
}

const NodeOffcanvas: FC<PropsNodeOffcanvas> = ({ formsData, nodeData, onSubmit, isNode, handleClose, nodes, edges }) => {
    const { register, handleSubmit, reset, watch, setValue, control } = useForm<INodeTypeItem>({ ...nodeData?.data })
    const [arrItem, setArrItem] = useState<any[]>([])

    useEffect(() => {
        reset({
            email: {},
            items: [],
            templateId: '',
            url: ''
        })
        reset({ ...nodeData?.data })
        setArrItem(getValues(nodeData?.type))
    }, [nodeData?.id])

    function getValues(type: string | undefined) {
        const familyNode: Node[] = []
        if (type == 'condition' || type == 'table') {
            let idNode: string | undefined = undefined
            let idNodePre: any = '-1';
            do {
                idNodePre = edges.find(e => e.target == (idNodePre == '-1' ? nodeData.id : idNode))?.source
                console.log(idNodePre)
                const iNode: number = nodes.findIndex(node => node.id == idNodePre)
                if (nodes[iNode] && familyNode.every(node => node.id != nodes[iNode].type)) {
                    const inNode = familyNode.every(node => node.id != idNodePre)
                    if (!inNode) {
                        nodes[iNode] && familyNode.push(nodes[iNode]); idNode = idNodePre
                    }
                }
                /* if (familyNode.length >= 2) {
                    idNodePre = undefined
                } */
            } while (idNodePre);
        }
        const values: any[] = []
        familyNode.map(node => {
            const subPre = `${node.type}`.toUpperCase()
            if (node.type == 'form') {
                const components = formsData.find(form => form.id == node.data.templateId)?.components
                components?.filter(e => e.type != 'button').forEach(item => {
                    values.push({ id: `${node.id}-${node.type}-${item.key}`, value: item.key, sub: item.label, label: subPre + ` ${item.label}`, color: '#c196da' })
                })
            } else if (node.type == 'tabel') {
                console.log(node.data.items)
                node.data.items.forEach((item: any) => {
                    values.push({ id: `${node.id}-${node.type}-${item.key}`, value: item.key, sub: item.sub, label: subPre + ` ${item.sub}`, color: '#88ca86' })
                })
            }
        })
        return values
    }

    return <Offcanvas show={isNode} onHide={handleClose} backdrop={false} placement='end'>
        <Offcanvas.Header closeButton className="py-3">
            <Offcanvas.Title>
                <span className="text-uppercase">{nodeData?.type}</span>:
                <span className="ms-1">{nodeData?.id}</span>
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="py-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="ilabel" className="form-label">Label</label>
                    <input className="form-control" id="ilabel" {...register('label')} />
                </div>
                {nodeData?.type == 'condition'
                    && <>
                        <div className="mb-3">
                            <label className="form-label">Search</label>
                            <Select
                                options={arrItem.filter(data => !(watch('items')?.map(e => e.id).includes(data.id)))}
                                value={undefined}
                                onChange={(e) => {
                                    if (e) {
                                        setValue('items', [...(watch("items") || []), { id: e.id, key: e.value, sub: e.sub, label: e.label, type: 'equal', value: '' }])
                                    }
                                    return undefined
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            {watch('items')?.map((item, index) => <div key={index}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-label">{item.label}</label>
                                    <button className="btn btn-link" onClick={() => setValue('items', watch('items')?.filter(e => e.key != item.key))}>Delete</button>
                                </div>
                                <div className="row gx-0">
                                    <div className="col-4 pe-2">
                                        <input className="form-control" {...register(`items.${index}.type`)} />
                                    </div>
                                    <div className="col-8">
                                        <input className="form-control" {...register(`items.${index}.value`)} />
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </>}
                {nodeData?.type == 'form'
                    && <div className="mb-3">
                        <label htmlFor="templateForm" className="form-label">Template</label>
                        <Controller
                            name="templateId"
                            control={control}
                            render={({ field: { value, onChange } }) => <Select
                                options={formsData.map(form => ({ value: form.id, label: form.title }))}
                                value={formsData.map(form => ({ value: form.id, label: form.title })).find(e => e.value == value)}
                                onChange={(e) => onChange(e?.value)}
                            />} />
                    </div>}
                {nodeData?.type == 'email'
                    && <>
                        <div className="mb-3">
                            <label htmlFor="fromname" className="form-label">From Name</label>
                            <input className="form-control" id="fromname" {...register('email.from.Name')} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fromemail" className="form-label">From Email</label>
                            <input className="form-control" id="fromemail" {...register('email.from.Email')} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="toemail" className="form-label">To Emails</label>
                            <textarea className="form-control" id="toemail" rows={1} {...register('email.to')}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="subject" className="form-label">Subject</label>
                            <input className="form-control" id="subject" {...register('email.subject')} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea className="form-control" id="message" rows={1} {...register('email.message')}></textarea>
                        </div>
                    </>}
                {nodeData?.type == 'table'
                    && <>
                        <div className="mb-3">
                            <label htmlFor="fromname" className="form-label">Url</label>
                            <input className="form-control" id="fromname" {...register('url')} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Search</label>
                            <Select
                                options={arrItem.filter(data => !(watch('items')?.map(e => e.id).includes(data.id)))}
                                value={undefined}
                                onChange={(e) => {
                                    if (e) {
                                        setValue('items', [...(watch("items") || []), { id: e.id, key: e.value, sub: e.sub, label: e.label, type: 'equal', value: '' }])
                                    }
                                    return undefined
                                }}
                            />
                        </div>
                        {watch('items') && <div className="mb-3">
                            <label htmlFor="fromname" className="form-label">Data table</label>
                            <div className="list-group">
                                {watch('items')?.map((item, index) => <div key={index} className='list-group-item p-0 px-2 bg-light'>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="form-label">{item.label}</label>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => setValue('items', watch('items')?.filter(e => e.key != item.key))}>
                                            Delete
                                        </button>
                                    </div>
                                </div>)}
                            </div>
                        </div>}
                    </>}
                <div className="d-flex">
                    <button className="ms-auto btn btn-primary">Save</button>
                </div>
            </form>
        </Offcanvas.Body>
    </Offcanvas>
}

export default NodeOffcanvas;