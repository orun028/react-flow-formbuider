import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import FormBuilder from '../../components/formio';
import PreviewForm from '../../components/formio/preview';
import { componentsFormDefault, IFormData } from '../../types/formio';
import { onSubmitAction, saveForm, urlForm } from './request';

export default function FormIoItemPage() {
  const { id } = useParams()
  const isUpdate = (id != 'new')
  const [jsonSchema, setSchema] = useState<IFormData>({ components: componentsFormDefault })

  useEffect(() => {
    async function getData() {
      await axios(`${urlForm}/${id}`)
        .then(res => setSchema({
          ...res.data,
          components: res.data.components || componentsFormDefault
        }))
        .catch(err => console.log(err))
    }
    if (isUpdate) { getData() }
  }, [])
  
  const [show, setShow] = useState(false);

  return <div className='container-fluid'>
    <div className='position-relative'>
      <Card className='h-100 border-0 card-body pt-0'>
        {/* header */}
        <HeaderFormBuilder title={jsonSchema.title || ''} {...{ isUpdate, setShow, jsonSchema }} />

        {/* builder */}
        <FormBuilder form={jsonSchema} onChange={(schema: any) => setSchema(schema)} />

        {/* preview */}
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{jsonSchema.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PreviewForm
              form={jsonSchema}
              onSubmit={onSubmitAction}
            />
          </Modal.Body>
        </Modal>
      </Card>
    </div>
  </div>
}

interface PropsHeaderFormBuilder {
  title: string
  isUpdate: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  jsonSchema: IFormData
}

const HeaderFormBuilder: FC<PropsHeaderFormBuilder> = (props) => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { setShow, jsonSchema, isUpdate } = props

  return <div className='d-flex pt-3 pb-1 mb-4 justify-content-between border-1 border-bottom'
    style={{ height: "60px" }}>
    <div className='d-flex'>
      <h4>{props.title}</h4>
    </div>
    <div className='d-flex gap-2'>
      <Link to={'/tool'} className="btn btn-light">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <button className='btn btn-outline-primary' onClick={() => setShow(true)}>
        Preview
      </button>
      <button className='btn btn-primary' onClick={() => {
        setIsLoading(true)
        saveForm(isUpdate, id, jsonSchema)
        setIsLoading(false)
      }}>
        {isLoading ? "Savings" : "Save form"}
      </button>
    </div>
  </div>
}