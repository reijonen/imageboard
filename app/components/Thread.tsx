"use client";
import { useState } from "react";
import { PostProps } from "@/types.d";

import Reply from "./Reply";

// TODO: fix
export const formatDate = (date: Date) => {
	const dateStr = date.toString();
	const idx = dateStr.indexOf(" GMT");
	return dateStr.substring(0, idx);
};

type ThreadProps = PostProps & {
	setFormOpen: (isOpen: boolean) => void;
};

const Thread = ({ id, createdAt, content, attachment, replies, setFormOpen }: ThreadProps) => {
	const [showImage, setShowImage] = useState(false);

	return (
		<div className="m-8 mt-0">
			<div>
				<img
					src={`/api/public?file=${attachment.name}`}
					className={`cursor-pointer ${showImage ? "mb-4" : "float-left mr-4 max-w-[200px] max-h-[2000px]"}`}
					onClick={() => setShowImage(!showImage)}
				/>
				<p className="mb-2 text-xs text-zinc-500">
					{formatDate(createdAt)} <label className="hover:text-slate-800 cursor-pointer" onClick={() => setFormOpen(true)}>No. {id}</label>
				</p>
				<p className="text-sm break-all">{content}</p>
			</div>

			<div>
				{replies.map((reply) => (
					<Reply {...reply} setFormOpen={setFormOpen} />
				))}
			</div>
		</div >
	);
};

export default Thread;