import { PostFormProps } from "@/types.d";

const PostForm = ({ board, threadId, isOpen }: PostFormProps) => {
	if (isOpen === false)
		return null;

	const isReply = threadId !== undefined;

	return (

		<div className={`w-full max-w-xs m-auto ${isReply ? "fixed top-2 right-2" : ""}`}>
			<form
				method="POST"
				action="/api/create-post"
				encType="multipart/form-data"
				className="bg-white border rounded px-8 pt-6 pb-8 mb-4 text-black"
			>
				<div className="mb-4">
					<label
						htmlFor="file"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Attachment
					</label>
					<input
						type="file"
						id="file"
						name="file"
						accept=".png,.jpg"
						className="appearance-none py-2 px-3 text-gray-700 leading-tight w-full"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="comment"
						className="block text-gray-700 text-sm font-bold mb-2"
					>
						Comment
					</label>
					<textarea
						id="comment"
						name="comment"
						className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						autoFocus
					/>
				</div>
				<input name="board" value={board} hidden />
				{threadId ? (
					<input name="threadId" value={threadId} hidden />
				) : null}
				<div className="flex justify-end">
					<button
						type="submit"
						className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Post
					</button>
				</div>
			</form>
		</div>
	);
};

export default PostForm;