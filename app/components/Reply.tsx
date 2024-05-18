"use client";
import { useEffect, useState } from "react";

import { PostProps } from "@/types.d";
import { formatDate } from "./Thread";

type ReplyProps = PostProps & {
	setFormOpen: (isOpen: boolean) => void;
};

const Reply = ({ id, createdAt, content, attachment, setFormOpen }: ReplyProps) => {
	const [showImage, setShowImage] = useState(false);
	const [highlight, setHighlight] = useState(false);

	useEffect(() => {
		const isHighlight = id === Number(window.location.hash.slice(1));
		setHighlight(isHighlight);
		document.getElementById(id.toString())?.scrollIntoView();
	}, []);

	return (
		<div id={id.toString()} className={`${highlight ? "bg-slate-300" : "bg-slate-100"} table pl-4 pr-4 pt-2 pb-4 mt-2 border border-t-0 border-l-0 border-slate-200 first:mt-4`}>
			<p className="mb-2 text-xs text-zinc-500">
				{formatDate(createdAt)} <label className="hover:text-slate-800 cursor-pointer" onClick={() => setFormOpen(true)}>No. {id}</label>
			</p>

			{attachment ? <img
				src={`/api/public?file=${attachment.name}`}
				className={`cursor-pointer ${showImage ? "" : "float-left mr-4 max-w-[125px] max-h-[125px]"}`}
				onClick={() => setShowImage(!showImage)}
			/> : null}
			<blockquote
				className="inline-block text-sm mt-2 min-w-[300px] break-all"
			>
				{content}
			</blockquote>
		</div>
	);
};

export default Reply;