import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className="container">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                    <a
                        href="/"
                        className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
                    >
                        <img src={"/3.jpg"} alt="logo" width={80} />
                    </a>
                    <span className="mb-3 mb-md-0 text-muted">
            © All Right Resrved to <b> Ritik Patel</b>{" "}
          </span>
                </div>

                <div className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <Link
                        to={"/"}
                        target="https://github.com/ritikpatel123"
                        className="mx-2"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <FaGithub />
                    </Link>
                    <Link
                        to={"/"}
                        target="https://www.linkedin.com/in/ritik-patel-51b4a6204/"
                        className="mx-2"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <FaLinkedin />
                    </Link>
                    <Link
                        to={"/"}
                        target="https://twitter.com/_Ritiik"
                        className="mx-2"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <FaSquareXTwitter />
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
