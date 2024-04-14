import { MdShare } from "react-icons/md";
import Button from "./button";

export default function SharePost({count=0, onClick=()=>{}}) {
    return (
        <Button
            onClick={onClick}
            className="flex items-center gap-2 text-green-600 hover:bg-gray-200">
            <MdShare />
            <span>{count}</span>
        </Button>

    );
}