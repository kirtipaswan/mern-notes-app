import moment from "moment";
import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
}) => {
    return (
        <div className={`border rounded-xl shadow-md p-12 bg-white transition-all ease-in-out hover:shadow-lg hover:-translate-y-1 ${isPinned ? 'border-primary' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-base font-medium text-slate-900">{title}</h6>
                    <span className="text-xs text-slate-500">{moment(date).format('Do MMM YYYY')}</span>
                </div>

                <MdOutlinePushPin 
                    className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} 
                    onClick={onPinNote} 
                />
            </div>

            <p className="text-xs text-slate-700 mt-2">{content?.slice(0, 60)}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500 flex flex-wrap gap-1">
                    {tags.map((item, index) => (
                        <span key={index} className="bg-slate-100 text-slate-800 px-2 py-1 rounded">
                            #{item}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                    <MdDelete className="icon-btn hover:text-red-600" onClick={onDelete} />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;