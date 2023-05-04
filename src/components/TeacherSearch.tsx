import { useState } from "react";
export const TeacherSearch: React.FC = () => {
        
    const [searchText, setSearchText] = useState("");



    return (
        <label>
            <input 
            value={searchText} 
            type="text" 
            defaultValue={"Enter teacher name here"} 
            onChange={e => {setSearchText(e.target.value)}}
            onKeyDown={e => {if (e.key === "Enter") {}}}/>
        </label>
        
    )
} 