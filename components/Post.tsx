import Attachment from "./Attachment"
import { PostProps } from "@/types.d"

const Post = ({ id, createdAt, content, attachment }: PostProps) => {
	return (
		<div>
			<div>
				<div>
					<p>{id}</p>
					<p>{createdAt.toDateString()}</p>
				</div>
				<p>{content}</p>
			</div>
			<div>
				<Attachment {...attachment} />
			</div>
		</div>
	)
}

export default Post