import Link from "next/link"

import { PostPreviewProps } from "@/types.d"
import Attachment from "./Attachment"

const PostPreview = (props: PostPreviewProps) => (
	<div>
		<Link href={`/${props.board}/${props.id}`}>
			<Attachment {...props.attachment} />
		</Link>
		<p className="text-center text-xs">
			R: <b>{props.replyCount}</b> / I: <b>{props.imageCount}</b>
		</p>
		<p className="break-all whitespace-normal text-center text-sm">
			{props.content.slice(0, 150)}
		</p>
	</div>
)

export default PostPreview