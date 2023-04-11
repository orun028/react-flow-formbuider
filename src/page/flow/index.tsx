import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IFlow } from "../../types/reactFlow";
import { urlFlow } from "./request";

const FlowPage = () => {
    const [flows, setFlows] = useState<IFlow[]>([]);
    useEffect(() => {
        async function getData() {
            const resData = await fetch(urlFlow).then(data => data.json())
            setFlows(resData)
        }
        getData()
    }, [])

    return <div className="row">
        {flows.map((flow) => <Link key={flow.id} to={`/flow/${flow.id}`} className="col-3 col-xxl-2">
            <Card body>
                <h4>{flow.title}</h4>
            </Card>
        </Link>)}
    </div>
}

export default FlowPage;