import { Form } from '@formio/react';
import { FC } from 'react';

const PreviewForm: FC<{ form?: object | undefined, onSubmit?: Function | undefined }> = (props) => {
    return <Form
        {...props}
    />
}

export default PreviewForm;