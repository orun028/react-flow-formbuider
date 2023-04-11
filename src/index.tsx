import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import FlowPage from './page/flow';
import FlowItemPage from './page/flow/reactFlow';
import FormIoItemPage from './page/formio/FormIoItem';
import FormIoPage from './page/formio';
import PreviewFormPage from './page/formio/PreviewForm';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [{
    index: true,
    path: "/tool",
    element: <FormIoPage />,
  }, {
    path: "/flow",
    element: <FlowPage/>,
  }]
}, {
  path: "/tool/:id",
  element: <FormIoItemPage />
}, {
  path: "/flow/:id",
  element: <FlowItemPage/>
}, {
  path: "/eform/:id",
  element: <PreviewFormPage/>
}]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render( <RouterProvider router={router} /> );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
