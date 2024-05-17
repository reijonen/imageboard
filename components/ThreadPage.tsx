"use client";
import { useState } from "react";
import Thread from "@/components/Thread";
import { ThreadParams } from "@/types.d";
import PostForm from "@/components/PostForm";

export default ({ board, thread }: ThreadParams) => {
	const [formOpen, setFormOpen] = useState(false);

	return (
		<div>
			<PostForm
				board={board}
				threadId={Number(thread.id)}
				isOpen={formOpen}
			/>
			<Thread {...thread} setFormOpen={setFormOpen} />
		</div>
	);
};