import { Edge, Node } from "reactflow";

export interface INodeCondition {
    id: string
    key: string
    sub: string
    value: string | number
    label: string
    type: string
}

export interface INodeEmail {
    from: { Email: string, Name: string },
    to: string,
    subject: string,
    message: string
}

export interface INodeTypeItem {
    label: string
    url?: string
    items?: INodeCondition[]
    templateId?: string
    email?: INodeEmail
    isSuccess?: boolean
    message?: string
}

export interface IFlow {
    id: string
    title: string
    nodes: Node[]
    edges: Edge[]
    history: {
        date: string
        nodes: Node[]
        edges: Edge[]
        message: string
        isSuccess: boolean
    }[]
}