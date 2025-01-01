interface Prop{
    text?: string;
    onClick?: ()=>void;
}
export default function Button({text, onClick}:Prop)
{
    return (
        <button onClick={onClick} className="p-2 bg-gray-200 hover:bg-gray-400">
            {text}
        </button>
    )
}
