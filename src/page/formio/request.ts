import axios from "axios"
import { triggerForm } from "../../flowAcion"
import { IFormData } from "../../types/formio"

export const urlForm = 'https://62be71a3be8ba3a10d53e0d0.mockapi.io/v1/forms'

export async function deleteFormById(id: string | undefined) {
    if (window.confirm("Why delete")) {
        await axios.delete(`${urlForm}/${id}`)
            .then(res => res.data)
            .catch(err => console.log(err))
    }
}

export async function saveForm(isUpdate: boolean, id: string | undefined, body: any) {
    const method = isUpdate ? "put" : "post"
    const saveId = isUpdate ? `/${id}` : ''
    return await axios[method](`${urlForm}${saveId}`, body)
        .then(res => res.data)
        .catch(err => console.log(err))
}

export async function onSubmitAction(form: any, jsonSchema: IFormData) {
    if (jsonSchema.flowId) {
        triggerForm(form, jsonSchema.flowId)
    }
}