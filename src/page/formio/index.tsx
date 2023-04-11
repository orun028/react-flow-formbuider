import React, { FC } from "react";
import { Card, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { IFormData } from "../../types/formio";
import { deleteFormById, urlForm } from "./request";

function FormIoPage() {
  const [forms, setForms] = React.useState<IFormData[]>([])
  const [formData, setFormData] = React.useState<IFormData | undefined>(undefined);

  React.useEffect(() => {
    async function getData() {
      const resData = await fetch(urlForm)
        .then(res => res.json())
        .catch(err => console.log(err))
      setForms(resData)
    }
    getData()
  }, [])

  return <>
    <div className="row mt-4">
      {forms.map(form => <div key={form.id} className="col-3 col-xxl-2" onClick={() => setFormData(form)}>
        <Card body>
          <h4 className="text-dark">{form.title}</h4>
          <p className="text-dark">{form.description}</p>
          <Link to={`/eform/${form.id}`} className="pt-2">View</Link>
        </Card>
      </div>)}
    </div>
    {formData && <EditFormModal {...{ formData, setFormData }} />}
  </>
}

export default FormIoPage;

interface IPropModal {
  formData: IFormData,
  setFormData: React.Dispatch<React.SetStateAction<IFormData | undefined>>
}

const EditFormModal: FC<IPropModal> = ({ formData, setFormData }) => {
  const { register,  handleSubmit } = useForm({ defaultValues: formData })

  async function onSubmit(data: IFormData) {
    await fetch(`${urlForm}/${formData.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .catch(err => console.log(err))
    clearData()
  }

  function clearData() {
    setFormData(undefined)
  }

  return <>
    <Modal show={!!formData} onHide={clearData}>
      <Modal.Header closeButton>
        <Modal.Title>{formData.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="form-flow" className="form-label">Flow</label>
            <input type="text" className="form-control" id="form-flow" {...register('flowId')} disabled/>
          </div>
          <div className="mb-3">
            <label htmlFor="form-title" className="form-label required">Share url</label>
            <input type="text" className="form-control" id="form-title" {...register('url')} disabled/>
          </div>
          <div className="mb-3">
            <label htmlFor="form-title" className="form-label">Title</label>
            <input type="text" className="form-control required" id="form-title" {...register('title')} />
          </div>
          <div className="mb-3">
            <label htmlFor="form-description" className="form-label">Description</label>
            <textarea className="form-control" id="form-description" rows={3} {...register('description')}></textarea>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-link text-danger" type="button" onClick={() => {
              deleteFormById(formData.id)
              clearData()
            }}>Delete form</button>
            <div className="d-flex gap-2">
              <Link to={`/tool/${formData.id}`} className="btn btn-outline-primary">
                Edit
              </Link>
              <button className="btn btn-primary" type="submit"> Save </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  </>
}