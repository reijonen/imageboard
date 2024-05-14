import { AttachmentType } from "@/types.d";

const parseMimeType = (mimeType: string): AttachmentType | null => {
	const firstPart = mimeType.split("/")[0]

	switch (firstPart) {
		case 'image':
			return AttachmentType.Image;
		case 'video':
			return AttachmentType.Video;
		case 'audio':
			return AttachmentType.Audio;
		default:
			return null;
	}
}

export default parseMimeType