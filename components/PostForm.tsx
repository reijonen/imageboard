import { PostFormProps } from "@/types.d"

const PostForm = ({ board, threadId }: PostFormProps) => (
	<div className={"w-full max-w-xs m-auto " + (threadId ? "absolute right-0" : "")}>
		<form
			method="POST"
			action="/api/create-post"
			encType="multipart/form-data"
			className="bg-white border rounded px-8 pt-6 pb-8 mb-4 text-black"
		>
			<h3 className="block text-gray-700 text-base font-bold mb-6">
				New Thread
			</h3>

			<div className="mb-4">
				<label
					htmlFor="file"
					className="block text-gray-700 text-sm font-bold mb-2"
				>
					File
				</label>
				<input
					type="file"
					id="file"
					name="file"
					accept=".png,.jpg,.mp4,.mp3"
					className="appearance-none py-2 px-3 text-gray-700 leading-tight"
				/>
			</div>
			<div className="mb-6">
				<label
					htmlFor="content"
					className="block text-gray-700 text-sm font-bold mb-2"
				>
					Content
				</label>
				<textarea
					id="content"
					name="content"
					className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<input name="board" value={board} hidden />
			{threadId ? (
				<input name="threadId" value={threadId} hidden />
			) : null}
			<div className="flex justify-end">
				<button
					type="submit"
					className="bg-teal-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				>
					Post
				</button>
			</div>
		</form>
	</div>
)

export default PostForm