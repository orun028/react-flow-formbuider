import { getFlowById, saveHistoryFlow } from "./page/flow/request"
import { INodeCondition, INodeEmail } from "./types/reactFlow"

interface IFormValue {
    data: any
    metadata: {
        browserName: string
        offset: number
        onLine: boolean
        origin: string
        pathName: string
        referrer: string
        timezone: string
        userAgent: string
    }
    state: string
}

export const triggerForm = async (formValue: IFormValue, flowId: string) => {
    let flow = await getFlowById(flowId)
    let actionData = flow
    if (flow) {
        let isRun = true
        let message = ''
        let { nodes } = actionData
        // const actionIndex = flow.nodes.findIndex((node: any) => node.type === 'form')
        // let sorteEdgesIndex = flow.edges.map((edge: any) => edge)

        flow.nodes.every((node: any, index: number) => {
            if (node.type === "condition") {
                isRun = node.data.items.every((check: INodeCondition) => {
                    if (check.type == 'equal') {
                        const lock = formValue.data[check.key] == check.value
                        if (!lock) {
                            message = `Error: value form key ${check.key} type ${check.type} value ${check.value}`
                        }
                        return lock
                    }
                })
                nodes[index] = updateNode(nodes, index, isRun, message)
                return isRun
            } else if (node.type === "email") {
                const { from, to, subject, message } = node.data.email as INodeEmail
                sendEmail(from, to.replace(/\s/g, '').split(',').map(e => ({ Email: e })), subject, message)
                nodes[index] = updateNode(nodes, index, isRun, message)
                return isRun
            } else if (node.type === "form") {
                nodes[index] = updateNode(nodes, index, isRun, message)
                return isRun
            } else {
                console.log('Node invalid')
            }
        })
        saveHistoryFlow({
            ...flow,
            history: [
                ...(flow.history || []),
                { date: new Date().toLocaleString(), nodes: actionData.nodes, edges: flow.edges, isSuccess: isRun, message: message }
            ]
        })
    }
    return 0
}

function updateNode(nodes: any, index: number, isRun: boolean, message: string) {
    return { ...nodes[index], data: { ...nodes[index].data, isSuccess: isRun, message: message } }
}

export const sendEmail = async (from: { Email: string, Name: string }, to: { Email: string }[], subject: string, message: string) => {
    try {
        const response = await fetch("http://localhost:3001/send-email", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...{ from, to, subject, message } })
        })
        const result_1 = await response.text()
        return console.log(result_1)
    } catch (error) {
        return console.log('error', error)
    }
}