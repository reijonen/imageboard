import Attachment from "./Attachment"
import { PostProps } from "@/types.d"

const Thread = ({ id, createdAt, content, attachment, replies }: PostProps) => {
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
			<div>
				{replies.map((reply) => (
					<div>
						{reply.attachment ? <Attachment {...reply.attachment} /> : null}
						<p>{reply.id}</p>
						<p>{reply.createdAt.toDateString()}</p>
						<p>{reply.content}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Thread