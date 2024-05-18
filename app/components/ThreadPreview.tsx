import Link from "next/link";

import { ThreadPreviewProps } from "@/types.d";
import Attachment from "./Attachment";

const ThreadPreview = (props: ThreadPreviewProps) => (
	<div className="max-w-[150px] max-h-[320px] overflow-hidden">
		<Link href={`/${props.board}/${props.id}`} className="block mb-1 pointer">
			<Attachment {...props.attachment} />
		</Link>
		<p className="text-center text-xs">
			R: <b>{props.replyCount}</b> / I: <b>{props.imageCount}</b>
		</p>
		<p className="break-all whitespace-normal text-center text-sm">
			{props.content}
		</p>
	</div>
);

export default ThreadPreview;