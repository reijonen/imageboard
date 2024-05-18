"use client";
import PostForm from "@/components/PostForm";
import ThreadPreview from "@/components/ThreadPreview";
import { PostProps } from "@/types";
import { useState } from "react";

type BoardProps = {
	board: {
		name: string,
		shorthand: string,
		posts: PostProps[];
	};
};

const Board = ({ board }: BoardProps) => {
	const [formOpen, setFormOpen] = useState(false);

	return (
		<div>
			<h1 className="text-slate-800 font-bold text-2xl ml-8 mt-4">
				{board.name}
			</h1>
			{!formOpen && (
				<h3 className="text-xl m-2 text-center">
					[<label
						onClick={() => setFormOpen(true)}
						className="text-slate-800 font-bold cursor-pointer">
						Start a new Thread
					</label>]
				</h3>
			)}
			<PostForm board={board.shorthand} isOpen={formOpen} />
			<div className="grid grid-cols-[repeat(auto-fill,150px)] gap-6 m-10 justify-start">
				{board.posts.map((post) => (
					<ThreadPreview
						key={post.id}
						board={board.shorthand}
						{...post}
					/>
				))}
			</div>
		</div>
	);
};

export default Board;