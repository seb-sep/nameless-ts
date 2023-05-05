import { useState } from "react";
import { api } from "~/utils/api";

const TeacherSearch: React.FC = () => {
        
    const [searchText, setSearchText] = useState("");

    const {data} = api.teachers.searchTeacher.useQuery({content: "Gary"});

    return (
        <>
            <label>
                <input 
                value={searchText} 
                type="text" 
                defaultValue={"Enter teacher name here"} 
                onChange={e => {setSearchText(e.target.value)}}
                onKeyDown={e => {if (e.key === "Enter") {}}}/>
            </label>
            <div>
                {data?.map(teacher => (<div key={teacher.id}>{teacher.name}</div>))}
            </div>

        </>

    )
} 

export default TeacherSearch;