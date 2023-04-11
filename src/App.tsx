import { Link, Outlet } from "react-router-dom";

const HomePage = () => {
    return <div className='position-relative p-4 d-flex flex-column gap-4'>
        <div className="d-flex gap-4 mb-">
            <Link to={'/'} className="btn btn-outline-secondary">Home</Link>
            <Link to={'/tool'} className="btn btn-outline-primary">Tool</Link>
            <Link to={'/tool/new'} className="btn btn-outline-primary">New Tool</Link>
            <Link to={'/flow'} className="btn btn-outline-danger">Flow</Link>
            <Link to={'/flow/new'} className="btn btn-outline-danger">New Flow</Link>
        </div>
        <Outlet />
    </div>
}

export default HomePage;