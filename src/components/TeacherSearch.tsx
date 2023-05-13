import { useState } from "react";
import { api } from "~/utils/api";
import { TeacherCard } from "./TeacherCard";


export const TeacherSearch: React.FC = () => {
        
    const [searchText, setSearchText] = useState("");
    
    const [searchTrigger, setSearchTrigger] = useState(0);
    const { data: teachers } = api.teachers.searchTeacher.useQuery({ content: searchText }, {
        enabled: searchTrigger > 0, 
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const searchTeachers: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === "Enter") {
            console.log("Hit enter key");
            setSearchTrigger(searchTrigger + 1);
            setSearchText("");
        }
    };

    return (
        <div className="w-full h-full">
            <input className="relative top-5 left-5"
            value={searchText} 
            type="text" 
            placeholder="Enter teacher name here"
            onChange={handleChange}
            onKeyDown={searchTeachers}/>
            <div>
                {teachers?.map(teacher => <TeacherCard key={teacher.id} id={teacher.id} name={teacher.name} college={teacher.college} />)}
            </div>

        </div>

    )
} 
