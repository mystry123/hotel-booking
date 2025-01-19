import { Link } from "react-router-dom";
import '../index.css'

const Notfound = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center background" style={{width:"100%"}}>
            <img src="/notfound.png" alt="notfound" />
            <button className=" my-4 btn btn-outline-primary btn-lg ">
                {" "}
                <Link
                    to={"/"}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    Return to Home{" "}
                </Link>{" "}
            </button>
        </div>

    );
};

export default Notfound;
