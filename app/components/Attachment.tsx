import { AttachmentProps, AttachmentType } from "@/types.d";

const Attachment = ({ name, attachmentTypeId }: AttachmentProps) => {
	switch (attachmentTypeId) {
		case AttachmentType.Image:
			return (
				<img
					src={`/api/public?file=${name}`}
					className="max-w-[150px] max-h-[150px] m-auto"
				/>
			);
		case AttachmentType.Video:
			return (
				<video controls>
					<source src={`/api/public?file=${name}`} />
				</video>
			);
		case AttachmentType.Audio:
			return (
				<video controls>
					<source src={`/api/public?file=${name}`} />
				</video>
			);
	}
};

export default Attachment;