export interface IFormData {
    id?: string
    title?: string
    description?: string
    components: any[]
    isActive?: boolean
    url?: string
    flowId?: string
}

export const componentsFormDefault = [{
    "label": "Text Field",
    "type": "textfield",
    "input": true,
    "inputType": "text",
    "id": "epev2k"
}]