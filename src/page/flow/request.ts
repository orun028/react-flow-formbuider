import axios from "axios";
import { Edge, Node } from "reactflow";
import { IFormData } from "../../types/formio";
import { urlForm } from "../formio/request";

export const urlFlow = 'https://62be71a3be8ba3a10d53e0d0.mockapi.io/v1/flows'

export async function saveFlow(isUpdate: boolean, id: string | undefined, data: { nodes: Node[], edges: Edge[] }) {
    const method = isUpdate ? "put" : "post"
    const saveId = isUpdate ? `/${id}` : ''
    await axios[method](`${urlFlow}${saveId}`, {
        ...data,
        title: isUpdate ? `FLow ${id}` : '',
    })
        .then(res => res.data)
        .catch(err => console.log(err))
}

export async function updateFlowToForm(form: IFormData, flowId: string) {
    return await axios.put(`${urlForm}/${form?.id}`, { ...form, flowId: flowId })
        .then(res => res.data)
        .catch(err => console.log(err))
}

export async function saveHistoryFlow(flow: any) {
    await axios.put(urlFlow + `/${flow.id}`, flow).then(res => res.data)
}

export async function getFlowById(flowId: string) {
    return await axios(urlFlow + `/${flowId}`).then(res => res.data)
}