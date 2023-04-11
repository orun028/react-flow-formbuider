import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PreviewForm from "../../components/formio/preview";
import { IFormData } from "../../types/formio";
import { onSubmitAction, urlForm } from "./request";

const PreviewFormPage = () => {
    const { id } = useParams()
    const [jsonSchema, setSchema] = useState<IFormData>({ components: [] })

    useEffect(() => {
        async function getData() {
            await axios(`${urlForm}/${id}`)
                .then(res => setSchema({
                    ...res.data,
                    components: res.data.components || []
                }))
                .catch(err => console.log(err))
        }
        if (id) {
            getData()
        }
    }, [])

    return <div className="container">
        <div className="py-4">
            <PreviewForm form={jsonSchema} onSubmit={onSubmitAction} />
        </div>
    </div>
}

export default PreviewFormPage;