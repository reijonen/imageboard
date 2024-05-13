import { AttachmentProps, AttachmentType } from "@/types.d"

const Attachment = ({ name, attachmentTypeId }: AttachmentProps) => {
	switch (attachmentTypeId) {
		case AttachmentType.Image:
			return (
				<img src={`/attachments/${name}`} />
			)
		case AttachmentType.Video:
			return (
				<video controls>
					<source src={`/attachments/${name}`} />
				</video>
			)
		case AttachmentType.Audio:
			return (
				<audio controls>
					<source src={`/attachments/${name}`} />
				</audio>
			)
	}
}

export default Attachment