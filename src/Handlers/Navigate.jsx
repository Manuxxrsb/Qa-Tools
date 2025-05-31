import { useNavigate } from "react-router-dom";

const useHandlerNavigate = (path) => {
    const navigate = useNavigate();
    return () => {
        navigate(path);
    };
};

export default useHandlerNavigate;
