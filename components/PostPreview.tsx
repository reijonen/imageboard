import Link from "next/link"

import { PostPreviewProps } from "@/types.d"
import Attachment from "./Attachment"

const PostPreview = (props: PostPreviewProps) => (
	<div>
		<Attachment {...props.attachment} />
		<div>
			<p><Link href={`/${props.board}/${props.id}`}>{props.id}</Link></p>
			<p>{props.createdAt.toDateString()}</p>
		</div>
		<p>{props.content}</p>
	</div>
)

export default PostPreview