import { AttachmentProps, AttachmentType } from "@/types.d"

const Attachment = ({ name, attachmentTypeId }: AttachmentProps) => {
	switch (attachmentTypeId) {
		case AttachmentType.Image:
			return (
				<img
					src={`/attachments/${name}`}
					className="object-contain"
				/>
			)
		case AttachmentType.Video:
			return (
				<video controls>
					<source src={`/attachments/${name}`} />
				</video>
			)
		case AttachmentType.Audio:
			return (
				<video controls>
					<source src={`/attachments/${name}`} />
				</video>
			)
	}
}

export default Attachment