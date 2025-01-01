interface Prop{
    name?:string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}
export default function Input({name, onChange, value}:Prop)
{
    return (
        <input type="text" name={name} className="p-4 border border-indigo-600 text-xl border-1 focus:outline-none" onChange={onChange} value={value}/>
    )
}