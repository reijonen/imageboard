function PostForm({ board }) {

	return (
		<form method="POST" action="/api/create-post" encType="multipart/form-data">
			<input type="file" name="file" accept=".png,.jpg,.mp4,.mp3" />
			<label htmlFor="content">Content</label>
			<input id="content" name="content" />
			<input name="board" value={board} hidden />
			<button type="submit">Submit</button>
		</form>
	)
}

export default PostForm